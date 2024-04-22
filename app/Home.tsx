'use client'

import { useTransition } from 'react'
import { useFormState } from 'react-dom'

import ArticleListItem from '../components/ArticleListItem'
import Page from '../components/layouts/Page'
import { Article } from '../lib/varlamovClient'

import { getArticles } from './actions/getArticles'

export default function Home({ initialData }: { initialData: Article[] }) {
	const [state, formAction] = useFormState<{
		data: Article[]
		error: string | undefined
	}>(
		async state => {
			try {
				const articles = await getArticles({ lastArticle: state.data.at(-1)?.id })
				return { data: [...state.data, ...articles], error: undefined }
			} catch (error) {
				return {
					data: state.data,
					error: error instanceof Error ? error.message : String(error),
				}
			}
		},
		{ data: initialData, error: undefined },
	)

	const [pending, startTransition] = useTransition()

	return (
		<Page className="max-w-xl" isHome>
			{state.data.length > 0
				? state.data.map(article => <ArticleListItem key={article.id} {...article} />)
				: state.error === undefined && (
						<header className="mb-8">
							<h2 className="mb-1 text-xl">Ничего не найдено</h2>
						</header>
					)}
			{state.error !== undefined && (
				<div className="mb-3">Ошибка загрузки: {state.error}</div>
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
