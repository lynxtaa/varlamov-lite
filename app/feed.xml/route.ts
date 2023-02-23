import { getRssFeed } from '../../lib/getRssFeed'

const thirtyMinutes = 30 * 60

export async function GET(): Promise<Response> {
	const rss = await getRssFeed()
	return new Response(rss, {
		headers: {
			'Content-Type': 'text/xml',
			'Cache-Control': `s-maxage=${thirtyMinutes}, stale-while-revalidate`,
		},
	})
}
