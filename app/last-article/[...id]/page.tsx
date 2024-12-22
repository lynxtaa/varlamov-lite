import { base64urlToDecimal, decimalToBase64url } from '../../../lib/decimal-base64url'
import { PAGE_SIZE, varlamovClient } from '../../../lib/varlamovClient'
import Home from '../../Home'

export const dynamic = 'error'

export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
	const { id } = await params

	const lastArticleBase64url = id.at(-1)!

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
					? `/last-article/${id.join('/')}/${decimalToBase64url(articles.at(-1)!.id)}`
					: undefined
			}
			prevPage={id.length === 1 ? '/' : `/last-article/${id.slice(0, -1).join('/')}`}
			pageNum={id.length + 1}
		/>
	)
}
