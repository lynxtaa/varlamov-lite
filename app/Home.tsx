import ArticleListItem from '../components/ArticleListItem'
import { Pagination } from '../components/Pagination'
import Page from '../components/layouts/Page'
import { type Article } from '../lib/varlamovClient'

export default function Home({
	initialData,
	prevPage,
	nextPage,
	pageNum,
}: {
	initialData: Article[]
	prevPage?: string
	nextPage?: string
	pageNum: number
}) {
	return (
		<Page className="max-w-xl" isHome={prevPage === undefined}>
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
