import { GetStaticProps } from 'next'

import Page from '../components/Page'
import { Article, varlamovClient } from '../lib/varlamovClient'

type Props = {
	initialData: Article[]
}

export default function Home({ initialData }: Props) {
	return <Page initialData={initialData} />
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const initialData = await varlamovClient.getArticles({ pageNum: 1 })

	return {
		props: { initialData },
		revalidate: 30 * 60, // every 30 minutes
	}
}
