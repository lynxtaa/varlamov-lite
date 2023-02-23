import { ArrowLeft, ArrowRight } from 'react-feather'

import ArticleListItem from '../../components/ArticleListItem'
import Icon from '../../components/Icon'
import Link from '../../components/Link'
import Page from '../../components/layouts/Page'
import { Article } from '../../lib/varlamovClient'

export type Props = {
	initialData: Article[]
	pageNum: number
	query: string
}

export default function SearchResults({ initialData, pageNum, query }: Props) {
	const pathname = `/search/${encodeURIComponent(query)}/`

	const prevPage = initialData.length > 0 ? `${pathname}page/${pageNum + 1}` : null

	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : null

	const rightIcon = <Icon icon={<ArrowRight />} className="w-7 h-7" />
	const leftIcon = <Icon icon={<ArrowLeft />} className="w-7 h-7" />

	return (
		<Page className="max-w-xl pb-0">
			<h1 className="text-3xl mb-8">{query}</h1>
			{initialData.length > 0 ? (
				initialData.map(article => <ArticleListItem key={article.id} {...article} />)
			) : (
				<header className="mb-8">
					<h2 className="mb-1 text-xl">Ничего не найдено</h2>
				</header>
			)}
			<div className="flex items-center sticky bottom-0 py-4 space-x-6 justify-end bg-gray-50 dark:bg-gray-900">
				{prevPage !== null ? (
					<Link href={prevPage} title="Предыдущая страница">
						{leftIcon}
					</Link>
				) : (
					<span className="opacity-50">{leftIcon}</span>
				)}
				<span>{pageNum}</span>
				{nextPage !== null ? (
					<Link href={nextPage} title="Следующая страница">
						{rightIcon}
					</Link>
				) : (
					<span className="opacity-50">{rightIcon}</span>
				)}
			</div>
		</Page>
	)
}
