import { URL, URLSearchParams } from 'url'

import cheerio from 'cheerio'
import fetch from 'node-fetch'
import PQueue from 'p-queue'
import probeImageSize from 'probe-image-size'

export type Article = {
	id: number
	title: string
}

export type ArticleWithText = Article & { text: string }

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
		return this.queue.add(() => probeImageSize(url).catch(() => null))
	}

	async getArticles({ pageNum }: { pageNum: number }): Promise<Article[]> {
		const qs =
			pageNum > 1
				? `?${new URLSearchParams({
						skip: String((pageNum - 1) * this.pageSize),
				  })}`
				: ''

		const html = await this.getHtml(`/${qs}`)

		const $ = cheerio.load(html)

		const articles = $('article[id^="entry-varlamov.ru"]')
			.toArray()
			.flatMap(el => {
				const titleLink = $('.j-e-title a', el)

				const match = /(?<id>\d+)\.html$/.exec(
					// https://varlamov.ru/4130750.html
					titleLink.attr('href') || '',
				)

				return match?.groups
					? [{ id: Number(match.groups.id), title: titleLink.text() }]
					: []
			})

		return articles
	}

	async getArticle(id: number): Promise<ArticleWithText> {
		const html = await this.getHtml(`/${id}.html`)

		const $ = cheerio.load(html)

		const textEl = $('#entrytext')
		textEl.find('br').replaceWith('\n')

		const images = textEl.find('img').toArray()

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

		const text = textEl.text().trim()
		const title = $('.j-e-title').text()

		return { id, title, text }
	}
}

export const varlamovClient = new VarlamovClient({ endpoint: 'https://varlamov.ru' })
