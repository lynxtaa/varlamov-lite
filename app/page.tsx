import { varlamovClient } from '../lib/varlamovClient'

import Home from './Home'

export default async function Page() {
	const articles = await varlamovClient.getArticles({
		next: {
			revalidate: 30 * 60, // every 30 minutes
		},
	})
	return <Home initialData={articles} />
}
