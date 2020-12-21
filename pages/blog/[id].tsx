import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'
import { varlamovClient, ArticleWithText } from '../../lib/varlamovClient'

type Props = {
	article: ArticleWithText
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
	const articles = await varlamovClient.getArticles({ pageNum: 1 })

	const paths = articles
		.slice(0, NUM_ARTICLES_TO_PRERENDER)
		.map(article => ({ params: { id: String(article.id) } }))

	return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const articleWithText = await varlamovClient.getArticle(Number(params!.id))

	return { props: { article: articleWithText } }
}
