import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetStaticProps } from 'next'

import { varlamovClient } from '../lib/varlamovClient'
import Home from '../routes/Home'

export default Home

export const getStaticProps: GetStaticProps = async () => {
	const queryClient = new QueryClient()

	await queryClient.prefetchInfiniteQuery(['articles'], () =>
		varlamovClient.getArticles(),
	)

	return {
		// https://github.com/tannerlinsley/react-query/issues/1458#issuecomment-788447705
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))) as unknown,
		},
		revalidate: 30 * 60, // every 30 minutes
	}
}
