import { varlamovClient } from '../lib/varlamovClient'

import Home from './Home'

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
			nextPage={nextPage !== undefined ? `/last-article/${nextPage}` : undefined}
			pageNum={1}
		/>
	)
}
