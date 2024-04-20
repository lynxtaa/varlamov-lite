'use server'

import { Article, varlamovClient } from '../../lib/varlamovClient'

export async function getArticles({
	lastArticle,
}: {
	lastArticle?: number
}): Promise<Article[]> {
	const thirtyMinutes = 30 * 60

	const articles = await varlamovClient.getArticles({
		lastArticle,
		next: {
			revalidate: thirtyMinutes,
		},
	})

	return articles
}
