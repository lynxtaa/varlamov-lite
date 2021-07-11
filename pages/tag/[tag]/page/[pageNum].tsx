import { GetStaticProps, GetStaticPaths } from 'next'

import { varlamovClient } from '../../../../lib/varlamovClient'
import SearchResults, { Props } from '../../../../routes/SearchResults'

export default SearchResults

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const tag = String(params!.tag)
	const pageNum = Number(params!.pageNum)

	const initialData = await varlamovClient.searchArticles(`#${tag}`, {
		pageNum,
	})

	return {
		props: { initialData, tag, pageNum },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
