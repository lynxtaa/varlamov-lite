import { URL, URLSearchParams } from 'url'

import cheerio from 'cheerio'
import pick from 'lodash/pick'
import truncate from 'lodash/truncate'
import PQueue from 'p-queue'
import probeImageSize from 'probe-image-size'

import { articleSchema, articlesSchema } from './schemas'

const BLOG_ID = 500000
const PAGE_SIZE = 7

export interface Article {
	id: number
	uri: string
	title: string
	created_at: string | null
}

export interface ArticleFull extends Article {
	previewImageUrl: string | null
	excerpt: string
	readingTime: number
	text: string
	tags: string[]
}

class VarlamovClient {
	endpoint: URL
	pageSize: number
	queue: PQueue
	supportTagsWithAttrs: Record<string, string[]>

	constructor({ endpoint, pageSize = 19 }: { endpoint: string; pageSize?: number }) {
		this.endpoint = new URL(endpoint)
		this.pageSize = pageSize
		this.queue = new PQueue({ concurrency: 5 })

		this.supportTagsWithAttrs = {
			'a[href]': ['href'],
			'b': [],
			'blockquote': [],
			'br': [],
			'em': [],
			'i': [],
			'iframe': ['src'],
			'img': ['src', 'width', 'height', 'alt'],
			'li': [],
			'p': [],
			'span': [],
			'strong': [],
			'ul': [],
		}
	}

	private async fetchTeletype(url: string, options?: RequestInit) {
		const response = await fetch(`https://teletype.in${url}`, {
			...options,
			headers: { Accept: 'application/json', ...options?.headers },
		})

		if (!response.ok) {
			throw new Error(`Error loading ${response.url}: ${response.status}`)
		}

		const json = await response.json()

		return json
	}

	private getImageSize(url: string) {
		return this.queue.add(() =>
			probeImageSize(encodeURI(url)).catch(err => {
				if (process.env.NODE_ENV === 'development') {
					// eslint-disable-next-line no-console
					console.warn(err)
				}
				return null
			}),
		)
	}

	async getArticles({
		lastArticle,
		limit = PAGE_SIZE,
	}: {
		lastArticle?: number
		limit?: number
	} = {}): Promise<Article[]> {
		const qs = new URLSearchParams({ limit: String(limit) })

		if (lastArticle) {
			qs.set('last_article', String(lastArticle))
		}

		const json = await this.fetchTeletype(
			`/api/blogs/id/${BLOG_ID}/articles?${qs.toString()}`,
		)

		const { articles } = articlesSchema.parse(json)

		return articles
	}

	async searchArticles(
		query: string,
		{ limit = PAGE_SIZE, pageNum = 1 }: { limit?: number; pageNum?: number } = {},
	): Promise<Article[]> {
		const json = await this.fetchTeletype('/api/search/articles', {
			method: 'POST',
			body: JSON.stringify({
				query,
				blog_id: BLOG_ID,
				limit,
				offset: limit * (pageNum - 1),
			}),
			headers: { 'Content-Type': 'application/json' },
		})

		const { articles } = articlesSchema.parse(json)

		return articles
	}

	private getFrameAttribsFromSrc(src: string) {
		try {
			const url = new URL(src)
			const source = url.searchParams.get('source')
			const vid = url.searchParams.get('vid')

			if (source === 'youtube' && vid) {
				return {
					src: `https://www.youtube.com/embed/${vid}`,
					frameBorder: '0',
					allow:
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
					allowFullScreen: '',
				}
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err)
		}

		return null
	}

	async getArticle(uri: string): Promise<ArticleFull> {
		const json = await this.fetchTeletype(
			`/api/blogs/domain/varlamov.ru/articles/${encodeURIComponent(uri)}`,
		)

		const article = articleSchema.parse(json)

		const $ = cheerio.load(article.text)

		const textEl = $('document')

		const excerpt =
			article.sharing_text || truncate(textEl.text().trim(), { length: 150 })

		const tags = $('tag')
			.toArray()
			.map(el => $(el).text().trim())

		textEl.find(`*:not(${Object.keys(this.supportTagsWithAttrs).join(', ')})`).remove()

		for (const [selector, attrList] of Object.entries(this.supportTagsWithAttrs)) {
			const foundElements = textEl.find(selector).toArray()
			for (const element of foundElements) {
				element.attribs = pick(element.attribs, attrList)
			}
		}

		const images = textEl.find('img').toArray()

		const [firstImage] = images

		const previewImageUrl = article.sharing_image
			? article.sharing_image
			: firstImage
			? $(firstImage).attr('src')
			: undefined

		await Promise.all(
			images.map(async image => {
				const img = $(image)
				const src = img.attr('src')

				const dimensions = src ? await this.getImageSize(src) : null

				if (dimensions && src) {
					image.attribs = {}
					img.attr('src', src)
					img.attr('width', String(dimensions.width))
					img.attr('height', String(dimensions.height))
				} else {
					img.remove()
				}
			}),
		)

		for (const link of textEl.find('a').toArray()) {
			const linkEl = $(link)
			const href = linkEl.attr('href')!
			link.attribs = {}
			linkEl.attr('href', href)
		}

		for (const iframe of textEl.find('iframe').toArray()) {
			const iframeEl = $(iframe)
			const src = iframeEl.attr('src')

			const attribs = src ? this.getFrameAttribsFromSrc(src) : null

			if (attribs) {
				iframe.attribs = attribs
			} else {
				iframeEl.remove()
			}
		}

		const text = textEl.html()?.trim() || ''

		const words = text.match(/\S+/g)
		const WORDS_PER_MINUTE = 200

		const readingTime = words
			? Math.round((words.length / WORDS_PER_MINUTE) * 60 * 1000)
			: 0

		return {
			id: article.id,
			uri: article.uri,
			excerpt,
			previewImageUrl: previewImageUrl || null,
			title: article.title,
			tags,
			text,
			created_at: article.created_at || null,
			readingTime,
		}
	}
}

export const varlamovClient = new VarlamovClient({ endpoint: 'https://varlamov.ru' })
