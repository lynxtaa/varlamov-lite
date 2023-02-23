import { varlamovClient } from '../../../lib/varlamovClient'
import SearchResults from '../SearchResults'

export default async function Page({ params }: { params: { query: string } }) {
	const query = decodeURIComponent(params.query)

	const initialData = await varlamovClient.searchArticles(query, {
		cache: 'no-store', // try using ISR in new NextJS versions
	})

	return <SearchResults initialData={initialData} pageNum={1} query={query} />
}
