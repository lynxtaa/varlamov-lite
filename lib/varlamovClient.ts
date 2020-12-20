import { URL } from 'url'

import cheerio from 'cheerio'
import fetch from 'node-fetch'

export type Article = {
	id: number
	title: string
}

export type ArticleWithText = Article & { text: string }

class VarlamovClient {
	endpoint: URL

	constructor(endpoint: string) {
		this.endpoint = new URL(endpoint)
	}

	private async getHtml(path: string) {
		const response = await fetch(`${this.endpoint.toString()}${path}`)

		if (!response.ok) {
			throw new Error(`Error loading ${response.url}: ${response.status}`)
		}

		const html = await response.text()

		return html
	}

	async getArticles(): Promise<Article[]> {
		const html = await this.getHtml('/')

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

		const text = textEl.text()
		const title = $('.j-e-title').text()

		return { id, title, text }
	}
}

export const varlamovClient = new VarlamovClient('https://varlamov.ru')
