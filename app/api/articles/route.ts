import { NextResponse } from 'next/server'

import { varlamovClient } from '../../../lib/varlamovClient'

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url)
	const lastArticle = searchParams.get('lastArticle')

	const thirtyMinutes = 30 * 60

	const articles = await varlamovClient.getArticles({
		lastArticle: lastArticle !== undefined ? Number(lastArticle) : undefined,
		next: {
			revalidate: thirtyMinutes,
		},
	})

	return NextResponse.json(articles, {
		headers: {
			'Cache-Control': `s-maxage=${thirtyMinutes}, stale-while-revalidate`,
		},
	})
}
