import { NextApiRequest, NextApiResponse } from 'next'

import { Article, varlamovClient } from '../../lib/varlamovClient'

export default async function articles(
	req: NextApiRequest,
	res: NextApiResponse<Article[]>,
): Promise<void> {
	if (req.method !== 'GET') {
		return res.status(405).end()
	}

	const { lastArticle } = req.query

	const articles = await varlamovClient.getArticles({
		lastArticle: lastArticle ? Number(lastArticle) : undefined,
	})

	if (lastArticle) {
		const thirtyMinutes = 30 * 60
		res.setHeader('Cache-Control', `s-maxage=${thirtyMinutes}, stale-while-revalidate`)
	}

	res.json(articles)
}
