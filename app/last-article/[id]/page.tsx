import { varlamovClient } from '../../../lib/varlamovClient'
import Home from '../../Home'

export default async function Page({ params }: { params: { id: string } }) {
	const lastArticle = params.id

	const articles = await varlamovClient.getArticles({
		lastArticle: Number(lastArticle),
		next: {
			revalidate: 30 * 60,
		},
	})

	return <Home initialData={articles} />
}
