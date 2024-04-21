'use client'

import { useTransition } from 'react'
import { useFormState } from 'react-dom'

import ArticleListItem from '../components/ArticleListItem'
import Page from '../components/layouts/Page'
import { Article } from '../lib/varlamovClient'

import { getArticles } from './actions/getArticles'

export default function Home({ initialData }: { initialData: Article[] }) {
	const [state, formAction] = useFormState<Article[]>(async state => {
		const articles = await getArticles({ lastArticle: state.at(-1)?.id })
		return [...state, ...articles]
	}, initialData)

	const [pending, startTransition] = useTransition()

	return (
		<Page className="max-w-xl" isHome>
			{state.length > 0 ? (
				state.map(article => <ArticleListItem key={article.id} {...article} />)
			) : (
				<header className="mb-8">
					<h2 className="mb-1 text-xl">Ничего не найдено</h2>
				</header>
			)}

			<button
				className="text-sm py-2 px-3 border rounded border-gray-700 border-solid mb-3 hover:no-underline"
				onClick={() => startTransition(() => formAction())}
				disabled={pending}
			>
				Показать больше {pending && '...'}
			</button>
		</Page>
	)
}
