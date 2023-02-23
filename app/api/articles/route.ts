import { varlamovClient } from '../../../lib/varlamovClient'

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url)
	const lastArticle = searchParams.get('lastArticle')

	const articles = await varlamovClient.getArticles({
		lastArticle: lastArticle !== undefined ? Number(lastArticle) : undefined,
	})

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	}

	if (lastArticle !== undefined) {
		const thirtyMinutes = 30 * 60
		headers['Cache-Control'] = `s-maxage=${thirtyMinutes}, stale-while-revalidate`
	}

	return new Response(JSON.stringify(articles), {
		status: 200,
		headers,
	})
}
