import { URL, URLSearchParams } from 'url'

import cheerio from 'cheerio'
import { parse as parseDate, isValid } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { ru } from 'date-fns/locale'
import pick from 'lodash/pick'
import truncate from 'lodash/truncate'
import PQueue from 'p-queue'
import probeImageSize from 'probe-image-size'

type Cheerio = ReturnType<typeof cheerio>

export interface Article {
	id: number
	title: string
	createdAt: string | null
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

	private async getHtml(path: string) {
		const response = await fetch(`${this.endpoint.toString()}${path.replace(/^\//, '')}`)

		if (!response.ok) {
			throw new Error(`Error loading ${response.url}: ${response.status}`)
		}

		const html = await response.text()

		return html
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

	private parseDate(el: Cheerio): Date | null {
		const text = el.text().trim()

		for (const format of ['d MMMM yyyy, HH:mm', 'd MMMM yyyy']) {
			const date = parseDate(text, format, new Date(), { locale: ru })

			if (isValid(date)) {
				return zonedTimeToUtc(date, 'Europe/Moscow')
			}
		}

		return null
	}

	async getArticles({
		pageNum,
		tag,
	}: {
		pageNum: number
		tag?: string
	}): Promise<Article[]> {
		const qs = new URLSearchParams()

		if (tag) {
			qs.append('tag', tag)
		}
		if (pageNum > 1) {
			qs.append('skip', String((pageNum - 1) * this.pageSize))
		}

		const html = await this.getHtml(`/?${qs.toString()}`)

		const $ = cheerio.load(html)

		const articles = $('article[id^="entry-varlamov.ru"]')
			.toArray()
			.flatMap(el => {
				const titleLink = $('.j-e-title a', el)

				const match = /(?<id>\d+)\.html$/.exec(
					// https://varlamov.ru/4130750.html
					titleLink.attr('href') || '',
				)

				if (!match?.groups) {
					return []
				}

				const createdAt = this.parseDate($('time[itemprop="dateCreated"]', el))

				return [
					{
						id: Number(match.groups.id),
						createdAt: createdAt ? createdAt.toISOString() : null,
						title: titleLink.text().trim(),
					},
				]
			})

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

	async getArticle(id: number): Promise<ArticleFull> {
		const html = await this.getHtml(`/${id}.html`)

		const $ = cheerio.load(html)

		const textEl = $('#entrytext')

		const excerpt = truncate(textEl.text().trim(), { length: 150 })

		textEl.find(`*:not(${Object.keys(this.supportTagsWithAttrs).join(', ')})`).remove()

		for (const [selector, attrList] of Object.entries(this.supportTagsWithAttrs)) {
			const foundElements = textEl.find(selector).toArray()
			for (const element of foundElements) {
				element.attribs = pick(element.attribs, attrList)
			}
		}

		const images = textEl.find('img').toArray()

		const [firstImage] = images

		const previewImageUrl = firstImage ? $(firstImage).attr('src') : undefined

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

		const title = $('.j-e-title').text().trim()
		const createdAt = this.parseDate($('time[itemprop="dateCreated"]').first())

		const tags = $('.j-e-tags-item')
			.toArray()
			.map(el => $(el).text().trim())

		const text = textEl.html() || ''

		const words = text.match(/\S+/g)
		const WORDS_PER_MINUTE = 200

		const readingTime = words
			? Math.round((words.length / WORDS_PER_MINUTE) * 60 * 1000)
			: 0

		return {
			id,
			excerpt,
			previewImageUrl: previewImageUrl || null,
			title,
			tags,
			text,
			createdAt: createdAt ? createdAt.toISOString() : null,
			readingTime,
		}
	}
}

export const varlamovClient = new VarlamovClient({ endpoint: 'https://varlamov.ru' })
