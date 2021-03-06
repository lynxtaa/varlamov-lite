import { useRouter } from 'next/router'
import { ArrowLeft, ArrowRight } from 'react-feather'

import Page from '../layouts/Page'
import { formatDate } from '../lib/formatDate'
import { Article } from '../lib/varlamovClient'

import Icon from './Icon'
import Link from './Link'

type Props = {
	initialData: Article[]
}

export default function ArticleList({ initialData }: Props) {
	const router = useRouter()

	const pageNum = Number(router.query.pageNum) || 1
	const tag = router.query.tag

	const pathname = tag ? `/tag/${encodeURIComponent(String(tag))}/` : '/'

	const prevPage = initialData.length > 0 ? `${pathname}page/${pageNum + 1}` : null
	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : null

	const rightIcon = <Icon icon={<ArrowRight />} className="w-7 h-7" />
	const leftIcon = <Icon icon={<ArrowLeft />} className="w-7 h-7" />

	return (
		<Page title={tag ? String(tag) : undefined} className="max-w-xl pb-0">
			{tag && <h1 className="text-3xl mb-8">{tag}</h1>}
			{initialData.length > 0 ? (
				initialData.map(article => (
					<header key={article.id} className="mb-8">
						<h2 className="mb-1 text-xl">
							<Link href={`/blog/${article.id}`}>{article.title}</Link>
						</h2>
						{article.createdAt && (
							<time className="opacity-70">{formatDate(article.createdAt)}</time>
						)}
					</header>
				))
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
