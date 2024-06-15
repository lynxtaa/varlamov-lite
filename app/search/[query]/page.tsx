import { PAGE_SIZE, varlamovClient } from '../../../lib/varlamovClient'
import SearchResults from '../SearchResults'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { query: string } }) {
	const query = decodeURIComponent(params.query)

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
