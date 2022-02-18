import { NextApiRequest, NextApiResponse } from 'next'

import { getRssFeed } from '../../lib/getRssFeed'

const thirtyMinutes = 30 * 60

export default async function rssXML(
	req: NextApiRequest,
	res: NextApiResponse<string>,
): Promise<void> {
	if (req.method !== 'GET') {
		res.status(405).end()
		return
	}

	const rss = await getRssFeed()
	res.setHeader('Content-Type', 'text/xml')
	res.setHeader('Cache-Control', `s-maxage=${thirtyMinutes}, stale-while-revalidate`)
	res.send(rss)
}
