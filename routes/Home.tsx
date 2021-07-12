import { useInfiniteQuery } from 'react-query'

import ArticleListItem from '../components/ArticleListItem'
import Page from '../components/layouts/Page'
import { Article } from '../lib/varlamovClient'

async function fetchArticles({ pageParam }: { pageParam?: number }) {
	const qs = pageParam ? new URLSearchParams({ lastArticle: String(pageParam) }) : null
	const response = await fetch(`/api/articles${qs ? `?${qs}` : ''}`)
	if (!response.ok) {
		throw new Error(`Error requesting ${response.url}: ${response.status}`)
	}
	const articles = (await response.json()) as Article[]
	return articles
}

export default function Home() {
	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery<Article[], Error>('articles', fetchArticles, {
			getNextPageParam: lastPage => lastPage[lastPage.length - 1]?.id,
			staleTime: 30 * 60 * 1000,
			cacheTime: 30 * 60 * 1000,
		})

	const articles = data && data.pages.flat()

	return (
		<Page className="max-w-xl">
			{articles ? (
				articles.length > 0 ? (
					articles.map(article => <ArticleListItem key={article.id} {...article} />)
				) : (
					<header className="mb-8">
						<h2 className="mb-1 text-xl">Ничего не найдено</h2>
					</header>
				)
			) : error ? (
				<span>{error.message}</span>
			) : null}
			{hasNextPage && (
				<button
					className="text-sm py-2 px-3 border rounded border-gray-700 border-solid mb-3 hover:no-underline"
					onClick={() => fetchNextPage()}
					disabled={isFetchingNextPage}
				>
					Показать больше {isFetchingNextPage && '...'}
				</button>
			)}
		</Page>
	)
}
