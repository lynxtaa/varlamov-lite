import Home from './Home'
import { getArticles } from './actions/getArticles'

export default async function Page() {
	const articles = await getArticles({})
	return <Home initialData={articles} />
}
