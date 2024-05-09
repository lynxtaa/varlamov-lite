import Home from './Home'
import { getArticles } from './actions/getArticles'

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const { lastArticle } = searchParams

	const articles = await getArticles({
		lastArticle:
			typeof lastArticle === 'string' &&
			lastArticle.trim() !== '' &&
			Number.isFinite(Number(lastArticle))
				? Number(lastArticle)
				: undefined,
	})
	return <Home initialData={articles} />
}
