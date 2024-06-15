import { decimalToBase64url } from '../lib/decimal-base64url'
import { varlamovClient } from '../lib/varlamovClient'

import Home from './Home'

export const dynamic = 'error'

export default async function Page() {
	const articles = await varlamovClient.getArticles({
		next: {
			revalidate: 30 * 60,
		},
	})

	const nextPage = articles.at(-1)?.id

	return (
		<Home
			initialData={articles}
			nextPage={
				nextPage !== undefined
					? `/last-article/${decimalToBase64url(nextPage)}`
					: undefined
			}
			pageNum={1}
		/>
	)
}
