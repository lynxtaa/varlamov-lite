import { varlamovClient } from '../../../../../lib/varlamovClient'
import SearchResults from '../../../SearchResults'

export default async function Page({
	params,
}: {
	params: { query: string; pageNum: string }
}) {
	const pageNum = Number(params.pageNum)
	const query = decodeURIComponent(params.query)

	const initialData = await varlamovClient.searchArticles(query, {
		pageNum,
		cache: 'no-store', // try using ISR in new NextJS versions
	})

	return <SearchResults initialData={initialData} pageNum={pageNum} query={query} />
}
