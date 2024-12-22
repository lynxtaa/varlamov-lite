import { PAGE_SIZE, varlamovClient } from '../../../../../lib/varlamovClient'
import SearchResults from '../../../SearchResults'

export const dynamic = 'force-dynamic'

export default async function Page({
	params,
}: {
	params: Promise<{ query: string; pageNum: string }>
}) {
	const { pageNum: pageNumRaw, query: queryRaw } = await params

	const pageNum = Number(pageNumRaw)
	const query = decodeURIComponent(queryRaw)

	const initialData = await varlamovClient.searchArticles(query, {
		pageNum,
		cache: 'no-store', // try using ISR in new NextJS versions
	})

	return (
		<SearchResults
			initialData={initialData}
			pageNum={pageNum}
			query={query}
			pageSize={PAGE_SIZE}
		/>
	)
}
