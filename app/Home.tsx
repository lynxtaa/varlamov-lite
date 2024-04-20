'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import ArticleListItem from '../components/ArticleListItem'
import Page from '../components/layouts/Page'
import { useIsOnScreen } from '../hooks/useIsOnScreen'
import { Article } from '../lib/varlamovClient'

import { getArticles } from './actions/getArticles'

const staleTime = 30 * 60 * 1000
const gcTime = 30 * 60 * 1000

export default function Home({ initialData }: { initialData: Article[] }) {
	const queryClient = useQueryClient()

	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery<
			Article[],
			Error,
			{ pages: Article[][] },
			ReadonlyArray<unknown>,
			number | undefined
		>({
			queryKey: ['articles'],
			initialPageParam: undefined,
			queryFn: async ({ pageParam }) =>
				queryClient.fetchQuery({
					queryKey: ['next-articles', pageParam],
					queryFn: async () => getArticles({ lastArticle: pageParam }),
					staleTime,
					gcTime,
				}),
			getNextPageParam: lastPage => lastPage.at(-1)?.id,
			staleTime,
			gcTime,
			initialData: {
				pages: [initialData],
				pageParams: [undefined],
			},
		})

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
			void queryClient.prefetchQuery({
				queryKey: ['next-articles', lastArticleId],
				queryFn: async () => getArticles({ lastArticle: lastArticleId }),
				staleTime,
				gcTime,
			})
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
