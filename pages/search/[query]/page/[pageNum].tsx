import { GetStaticProps, GetStaticPaths } from 'next'

import { varlamovClient } from '../../../../lib/varlamovClient'
import { Props } from '../../../../routes/SearchResults'

export { default } from '../../../../routes/SearchResults'

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const query = String(params!.query)
	const pageNum = Number(params!.pageNum)

	const initialData = await varlamovClient.searchArticles(query, {
		pageNum,
	})

	return {
		props: { initialData, query, pageNum },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
