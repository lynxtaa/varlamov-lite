import { base64urlToDecimal, decimalToBase64url } from '../../../lib/decimal-base64url'
import { PAGE_SIZE, varlamovClient } from '../../../lib/varlamovClient'
import Home from '../../Home'

export const dynamic = 'error'

export default async function Page({ params }: { params: { id: string[] } }) {
	const lastArticleBase64url = params.id.at(-1)!

	const articles = await varlamovClient.getArticles({
		lastArticle: base64urlToDecimal(lastArticleBase64url),
		next: {
			revalidate: 30 * 60,
		},
	})

	return (
		<Home
			initialData={articles}
			nextPage={
				articles.length === PAGE_SIZE
					? `/last-article/${params.id.join('/')}/${decimalToBase64url(articles.at(-1)!.id)}`
					: undefined
			}
			prevPage={
				params.id.length === 1 ? '/' : `/last-article/${params.id.slice(0, -1).join('/')}`
			}
			pageNum={params.id.length + 1}
		/>
	)
}
