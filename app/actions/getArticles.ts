'use server'

import { Article, varlamovClient } from '../../lib/varlamovClient'

export async function getArticles({
	lastArticle,
}: {
	lastArticle?: number
}): Promise<Article[]> {
	const thirtyMinutes = 30 * 60

	await new Promise(resolve => setTimeout(resolve, 7000))

	const articles = await varlamovClient.getArticles({
		lastArticle,
		next: {
			revalidate: thirtyMinutes,
		},
	})

	return articles
}
