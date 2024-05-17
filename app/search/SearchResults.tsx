import ArticleListItem from '../../components/ArticleListItem'
import { Pagination } from '../../components/Pagination'
import Page from '../../components/layouts/Page'
import { type Article } from '../../lib/varlamovClient'

export type Props = {
	initialData: Article[]
	pageNum: number
	query: string
	pageSize: number
}

export default function SearchResults({ initialData, pageNum, query, pageSize }: Props) {
	const pathname = `/search/${encodeURIComponent(query)}/`

	const prevPage =
		initialData.length > 0 && initialData.length === pageSize
			? `${pathname}page/${pageNum + 1}`
			: undefined

	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : undefined

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
			<Pagination prevPage={prevPage} nextPage={nextPage} pageNum={pageNum} />
		</Page>
	)
}
