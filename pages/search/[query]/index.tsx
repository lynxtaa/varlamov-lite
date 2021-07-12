import { GetStaticPaths, GetStaticProps } from 'next'

import { varlamovClient } from '../../../lib/varlamovClient'
import SearchResults, { Props } from '../../../routes/SearchResults'

export default SearchResults

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const query = String(params!.query)
	const initialData = await varlamovClient.searchArticles(query)

	return {
		props: { initialData, pageNum: 1, query },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
