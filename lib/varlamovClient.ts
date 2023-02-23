// TODO: it fails when requiring `varlamovClient` inside pages/app
// enable it, when this is fixed
// import 'server-only'

import * as cheerio from 'cheerio'
import pick from 'lodash/pick'
import truncate from 'lodash/truncate'
import PQueue from 'p-queue'
import probeImageSize from 'probe-image-size'

import { createFetch, FetchFunction } from './createFetch'
import { getYoutubeVideoId } from './getYoutubeVideoId'
import { articleSchema, articlesSchema } from './schemas'

const BLOG_ID = 500000
const PAGE_SIZE = 7

export interface Article {
	id: number
	uri: string
	title: string
	published_at: string | null
}

export interface ArticleFull extends Article {
	previewImageUrl: string | null
	excerpt: string
	readingTime: number
	text: string
	tags: string[]
	topics: { name: string }[]
}

type CacheOptions = Pick<RequestInit, 'cache' | 'next'>

class VarlamovClient {
	pageSize: number
	queue: PQueue
	supportTagsWithAttrs: Record<string, string[]>
	#fetchTeletype: FetchFunction

	constructor({ pageSize = 19 }: { pageSize?: number } = {}) {
		this.pageSize = pageSize
		this.queue = new PQueue({ concurrency: 5 })

		this.supportTagsWithAttrs = {
			'a[href]': ['href'],
			'b': [],
			'blockquote': [],
			'br': [],
			'em': [],
			'figcaption': [],
			'figure': [],
			'i': [],
			'iframe': ['src', 'frameBorder', 'allow', 'allowFullScreen'],
			'img': ['src', 'width', 'height', 'alt'],
			'li': [],
			'p': [],
			'span': [],
			'strong': [],
			'ul': [],
			'section': [],
		}

		this.#fetchTeletype = createFetch({
			timeout: 20_000,
			headers: { accept: 'application/json' },
			prefixUrl: 'https://teletype.in/',
		})
	}

	private getImageSize(url: string) {
		return this.queue.add(() =>
			probeImageSize(encodeURI(url)).catch(err => {
				if (process.env.NODE_ENV === 'development') {
					console.warn(err)
				}
				return null
			}),
		)
	}

	async getArticles({
		lastArticle,
		limit = PAGE_SIZE,
		...options
	}: {
		lastArticle?: number
		limit?: number
	} & CacheOptions = {}): Promise<Article[]> {
		const searchParams = new URLSearchParams({ limit: String(limit) })
		if (lastArticle !== undefined) {
			searchParams.set('last_article', String(lastArticle))
		}

		const { articles } = await this.#fetchTeletype(
			`api/blogs/id/${BLOG_ID}/articles?${searchParams.toString()}`,
			{ ...options, schema: articlesSchema },
		)

		return articles
	}

	async searchArticles(
		query: string,
		{
			limit = PAGE_SIZE,
			pageNum = 1,
			...options
		}: { limit?: number; pageNum?: number } & CacheOptions = {},
	): Promise<Article[]> {
		const { articles } = await this.#fetchTeletype('api/search', {
			method: 'POST',
			json: {
				query,
				blogs: false,
				articles: true,
				blog_id: BLOG_ID,
				limit,
				offset: limit * (pageNum - 1),
			},
			...options,
			schema: articlesSchema,
		})

		return articles
	}

	async getArticle(uri: string, options?: CacheOptions): Promise<ArticleFull> {
		const article = await this.#fetchTeletype(
			`api/blogs/domain/varlamov.ru/articles/${encodeURIComponent(uri)}`,
			{ ...options, schema: articleSchema },
		)

		const $ = cheerio.load(article.text, { xmlMode: true, decodeEntities: false })

		const textEl = $('document')

		const tags = $('tag')
			.toArray()
			.map(el => $(el).text().trim())

		// Заменим конструкции <image src="http://example.com"><caption>Подпись</caption></image>
		// на <img src="http://example.com" /><caption>Подпись</caption>
		for (const image of textEl.find('image').toArray()) {
			const $image = $(image)

			$image.after('<img />')
			const $img = $image.next()
			for (const [attr, value] of Object.entries(image.attribs)) {
				$img.attr(attr, value)
			}
			const caption = $image.find('caption').html()

			if (caption !== null && caption !== '') {
				$img.wrap('<figure></figure>')
				$img.after(`<figcaption>${caption}</figcaption>`)
			}

			$image.remove()
		}

		// Заменим конструкции <youtube src="https://www.youtube.com/embed/fw5hbjqBiSA" />
		// на iframe'ы
		for (const youtube of textEl.find('youtube').toArray()) {
			const $youtube = $(youtube)
			const src = $youtube.attr('src')

			if (src !== undefined && src !== '') {
				const vidId = getYoutubeVideoId(src)

				if (vidId !== null) {
					$youtube.after('<iframe> </iframe>')
					const frame = $youtube.next()
					frame.attr('src', `https://www.youtube.com/embed/${vidId}`)
					frame.attr('frameBorder', '0')
					frame.attr(
						'allow',
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
					)
					frame.attr('allowFullScreen', '')
				}
			}
			$youtube.remove()
		}

		textEl.find(`*:not(${Object.keys(this.supportTagsWithAttrs).join(', ')})`).remove()

		for (const [selector, attrList] of Object.entries(this.supportTagsWithAttrs)) {
			const foundElements = textEl.find(selector).toArray()
			for (const element of foundElements) {
				element.attribs = pick(element.attribs, attrList)
			}
		}

		const images = textEl.find('img').toArray()

		const [firstImage] = images

		const previewImageUrl =
			article.sharing_image !== undefined
				? article.sharing_image
				: firstImage
				? $(firstImage).attr('src')
				: undefined

		await Promise.all(
			images.map(async image => {
				const img = $(image)
				const src = img.attr('src')

				if (src === undefined || src === '') {
					img.remove()
					return
				}

				const width = img.attr('width')
				const height = img.attr('height')

				if (
					width === undefined ||
					width === '' ||
					height === undefined ||
					height === ''
				) {
					const dimensions = await this.getImageSize(src)

					if (dimensions) {
						// eslint-disable-next-line require-atomic-updates
						image.attribs = {}
						img.attr('src', src)
						img.attr('width', String(dimensions.width))
						img.attr('height', String(dimensions.height))
					} else {
						img.remove()
					}
				}
			}),
		)

		const plainText = textEl.text().trim()

		const html = textEl.html()?.trim() ?? ''

		const words = plainText.match(/\S+/g)
		const WORDS_PER_MINUTE = 200

		const excerpt = article.sharing_text ?? truncate(plainText, { length: 150 })

		const readingTime = words
			? Math.round((words.length / WORDS_PER_MINUTE) * 60 * 1000)
			: 0

		return {
			id: article.id,
			uri: article.uri,
			excerpt,
			previewImageUrl:
				previewImageUrl !== undefined && previewImageUrl !== '' ? previewImageUrl : null,
			title: article.title,
			tags,
			text: html,
			published_at: article.published_at ?? null,
			readingTime,
			topics: article.topics ?? [],
		}
	}
}

export const varlamovClient = new VarlamovClient()
