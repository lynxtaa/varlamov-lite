import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import ArticleList from '../../components/ArticleList'
import Spinner from '../../components/Spinner'
import { assert } from '../../lib/assert'
import { Article, varlamovClient } from '../../lib/varlamovClient'

type Props = {
	initialData: Article[]
}

export default function Tag({ initialData }: Props) {
	const router = useRouter()

	if (router.isFallback) {
		return <Spinner />
	}

	return <ArticleList initialData={initialData} />
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	assert(params, 'params must be defined')

	const initialData = await varlamovClient.getArticles({
		pageNum: 1,
		tag: String(params.tag),
	})

	return {
		props: { initialData },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
