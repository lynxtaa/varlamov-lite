import Home from '../../Home'
import { getArticles } from '../../actions/getArticles'

export default async function Page({ params }: { params: { id: string } }) {
	const lastArticle = params.id

	const articles = await getArticles({
		lastArticle: Number(lastArticle),
	})
	return <Home initialData={articles} />
}
