import ArticleListItem from '../components/ArticleListItem'
import Link from '../components/Link'
import Page from '../components/layouts/Page'
import { Article } from '../lib/varlamovClient'

export default function Home({
	initialData,
	isFirstPage = false,
}: {
	initialData: Article[]
	isFirstPage?: boolean
}) {
	return (
		<Page className="max-w-xl" isHome={isFirstPage}>
			{initialData.length > 0 ? (
				initialData.map(article => <ArticleListItem key={article.id} {...article} />)
			) : (
				<header className="mb-8">
					<h2 className="mb-1 text-xl">Ничего не найдено</h2>
				</header>
			)}
			{initialData.at(-1) && (
				<Link
					href={`/last-article/${initialData.at(-1)!.id}`}
					className="text-sm py-2 px-3 border rounded border-gray-700 border-solid mb-3 hover:no-underline"
				>
					Назад
				</Link>
			)}
		</Page>
	)
}
