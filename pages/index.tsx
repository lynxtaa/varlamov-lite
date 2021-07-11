import { GetStaticProps } from 'next'

import ArticleList from '../components/ArticleList'
import { Article, varlamovClient } from '../lib/varlamovClient'

type Props = {
	initialData: Article[]
}

export default function Home({ initialData }: Props) {
	return <ArticleList initialData={initialData} />
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const initialData = await varlamovClient.getArticles()

	return {
		props: { initialData },
		revalidate: 30 * 60, // every 30 minutes
	}
}
