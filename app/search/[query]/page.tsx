import { PAGE_SIZE, varlamovClient } from '../../../lib/varlamovClient'
import SearchResults from '../SearchResults'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ query: string }> }) {
	const { query: queryRaw } = await params

	const query = decodeURIComponent(queryRaw)

	const initialData = await varlamovClient.searchArticles(query, {
		next: {
			revalidate: 60 * 60,
		},
	})

	return (
		<SearchResults
			initialData={initialData}
			pageNum={1}
			query={query}
			pageSize={PAGE_SIZE}
		/>
	)
}
