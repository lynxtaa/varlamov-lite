import RSS from 'rss'

import { varlamovClient } from './varlamovClient'

export async function getRssFeed(): Promise<string> {
	const feed = new RSS({
		title: 'Блог Ильи Варламова',
		site_url: 'https://varlamov-lite.vercel.app',
		feed_url: 'https://varlamov-lite.vercel.app/feed.xml',
		language: 'ru',
	})

	const articles = await varlamovClient.getArticles({ pageNum: 1 })

	for (const article of articles) {
		const url = `https://varlamov-lite.vercel.app/blog/${article.id}`

		feed.item({
			title: article.title,
			description: '',
			date: article.createdAt || new Date(),
			author: 'Илья Варламов',
			url,
			guid: url,
		})
	}

	return feed.xml({ indent: true })
}
