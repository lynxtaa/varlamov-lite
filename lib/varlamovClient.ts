import { URL, URLSearchParams } from 'url'

import cheerio from 'cheerio'
import { parse as parseDate, isValid } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { ru } from 'date-fns/locale'
import truncate from 'lodash.truncate'
import fetch from 'node-fetch'
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
	text: string
	tags: string[]
}

class VarlamovClient {
	endpoint: URL
	pageSize: number
	queue: PQueue

	constructor({ endpoint, pageSize = 19 }: { endpoint: string; pageSize?: number }) {
		this.endpoint = new URL(endpoint)
		this.pageSize = pageSize
		this.queue = new PQueue({ concurrency: 5 })
	}

	private async getHtml(path: string) {
		const response = await fetch(`${this.endpoint.toString()}${path}`)

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
						title: titleLink.text(),
					},
				]
			})

		return articles
	}

	async getArticle(id: number): Promise<ArticleFull> {
		let html = await this.getHtml(`/${id}.html`)
		html = html.replace(/\n/g, '')

		const $ = cheerio.load(html)

		const textEl = $('#entrytext')

		const excerpt = truncate(textEl.text().trim(), { length: 100 })

		// На фронте img будет завёрнут в div и станет блочным элементом,
		// поэтому переносы строк после img не нужны
		textEl.find('img + br').remove()

		// Удалим странные пустые ссылки, фреймы
		textEl.find('a:not(a[href]), iframe').remove()

		textEl.find('br').replaceWith('\n')

		const images = textEl.find('img').toArray()

		const [firstImage] = images

		const previewImageUrl = firstImage ? $(firstImage).attr('src') : undefined

		await Promise.all(
			images.map(async image => {
				const img = $(image)
				const src = img.attr('src')

				if (src) {
					const dimensions = await this.getImageSize(src)

					if (dimensions) {
						img.replaceWith(() =>
							$(`<span>![${dimensions.width}x${dimensions.height}](${src})</span>`),
						)
					}
				}
			}),
		)

		for (const link of textEl.find('a').toArray()) {
			const linkEl = $(link)
			const href = linkEl.attr('href')
			if (href) {
				linkEl.replaceWith(`<span>[${linkEl.text()}](${href})</span>`)
			}
		}

		const text = textEl.text().trim()
		const title = $('.j-e-title').text().trim()
		const createdAt = this.parseDate($('time[itemprop="dateCreated"]').first())

		const tags = $('.j-e-tags-item')
			.toArray()
			.map(el => $(el).text().trim())

		return {
			id,
			excerpt,
			previewImageUrl: previewImageUrl || null,
			title,
			tags,
			text,
			createdAt: createdAt ? createdAt.toISOString() : null,
		}
	}
}

export const varlamovClient = new VarlamovClient({ endpoint: 'https://varlamov.ru' })
