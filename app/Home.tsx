'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import ArticleListItem from '../components/ArticleListItem'
import Page from '../components/layouts/Page'
import { useIsOnScreen } from '../hooks/useIsOnScreen'
import { Article } from '../lib/varlamovClient'

import { getArticles } from './actions/getArticles'

const staleTime = 30 * 60 * 1000
const cacheTime = 30 * 60 * 1000

export default function Home({ initialData }: { initialData: Article[] }) {
	const queryClient = useQueryClient()

	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery<Article[], Error>(
			['articles'],
			async ({ pageParam }: { pageParam?: number }) =>
				queryClient.fetchQuery(
					['next-articles', pageParam],
					async () => getArticles({ lastArticle: pageParam }),
					{ staleTime, cacheTime },
				),
			{
				getNextPageParam: lastPage => lastPage.at(-1)?.id,
				staleTime,
				cacheTime,
				initialData: {
					pages: [initialData],
					pageParams: [undefined],
				},
			},
		)

	const buttonRef = useRef<HTMLButtonElement>(null)

	const isButtonVisible = useIsOnScreen(buttonRef.current)

	const articles = data?.pages.flat()

	const lastArticleId = articles?.[articles.length - 1]?.id

	useEffect(() => {
		if (
			lastArticleId !== undefined &&
			!isFetchingNextPage &&
			isButtonVisible &&
			hasNextPage === true
		) {
			void queryClient.prefetchQuery(
				['next-articles', lastArticleId],
				async () => getArticles({ lastArticle: lastArticleId }),
				{ staleTime, cacheTime },
			)
		}
	}, [hasNextPage, isButtonVisible, isFetchingNextPage, lastArticleId, queryClient])

	return (
		<Page className="max-w-xl" isHome>
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
			{hasNextPage === true && (
				<button
					className="text-sm py-2 px-3 border rounded border-gray-700 border-solid mb-3 hover:no-underline"
					onClick={() => {
						void fetchNextPage()
					}}
					disabled={isFetchingNextPage}
					ref={buttonRef}
				>
					Показать больше {isFetchingNextPage && '...'}
				</button>
			)}
		</Page>
	)
}
