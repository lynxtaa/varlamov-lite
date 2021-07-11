import { useRouter } from 'next/router'
import { ArrowLeft, ArrowRight } from 'react-feather'

import ArticleListItem from '../components/ArticleListItem'
import Icon from '../components/Icon'
import Link from '../components/Link'
import Spinner from '../components/Spinner'
import Page from '../layouts/Page'
import { Article } from '../lib/varlamovClient'

export type Props = {
	initialData: Article[]
	pageNum: number
	tag: string
}

export default function SearchResults({ initialData, pageNum, tag }: Props) {
	const router = useRouter()

	if (router.isFallback) {
		return <Spinner />
	}

	const pathname = `/tag/${encodeURIComponent(tag)}/`

	const prevPage = initialData.length > 0 ? `${pathname}page/${pageNum + 1}` : null

	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : null

	const rightIcon = <Icon icon={<ArrowRight />} className="w-7 h-7" />
	const leftIcon = <Icon icon={<ArrowLeft />} className="w-7 h-7" />

	return (
		<Page title={tag} className="max-w-xl pb-0">
			<h1 className="text-3xl mb-8">{tag}</h1>
			{initialData.length > 0 ? (
				initialData.map(article => <ArticleListItem key={article.id} {...article} />)
			) : (
				<header className="mb-8">
					<h2 className="mb-1 text-xl">Ничего не найдено</h2>
				</header>
			)}
			<div className="flex items-center sticky bottom-0 py-4 space-x-6 justify-end bg-gray-50 dark:bg-gray-900">
				{prevPage ? (
					<Link href={prevPage} title="Предыдущая страница">
						{leftIcon}
					</Link>
				) : (
					<span className="opacity-50">{leftIcon}</span>
				)}
				<span>{pageNum}</span>
				{nextPage ? (
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
