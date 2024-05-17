import { redirect } from 'next/navigation'

import { isNumber } from '../../../lib/is-number'
import { PAGE_SIZE, varlamovClient } from '../../../lib/varlamovClient'
import Home from '../../Home'

export default async function Page({ params }: { params: { id: string[] } }) {
	const lastArticle = params.id.at(-1)!

	if (!isNumber(lastArticle)) {
		return redirect('/')
	}

	const articles = await varlamovClient.getArticles({
		lastArticle: Number(lastArticle),
		next: {
			revalidate: 30 * 60,
		},
	})

	return (
		<Home
			initialData={articles}
			nextPage={
				articles.length === PAGE_SIZE
					? `/last-article/${params.id.join('/')}/${articles.at(-1)!.id}`
					: undefined
			}
			prevPage={
				params.id.length === 1 ? '/' : `/last-article/${params.id.slice(0, -1).join('/')}`
			}
			pageNum={params.id.length + 1}
		/>
	)
}
