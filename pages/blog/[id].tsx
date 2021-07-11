import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'
import { assert } from '../../lib/assert'
import { varlamovClient, ArticleFull } from '../../lib/varlamovClient'

type Props = {
	article: ArticleFull
}

export default function Post({ article }: Props) {
	const router = useRouter()

	if (router.isFallback) {
		return <Spinner />
	}

	return <Article {...article} />
}

const NUM_ARTICLES_TO_PRERENDER = 5

export const getStaticPaths: GetStaticPaths = async function () {
	const articles = await varlamovClient.getArticles()

	const paths = articles
		.slice(0, NUM_ARTICLES_TO_PRERENDER)
		.map(article => ({ params: { id: String(article.uri) } }))

	return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
	assert(params, 'params must be defined')

	let id = String(params.id)
	id = /^\d+$/.test(id) ? `${id}.html` : id

	const article = await varlamovClient.getArticle(id)

	return {
		props: { article },
		revalidate: 60 * 60, // every hour
	}
}
