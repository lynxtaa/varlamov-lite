import { GetStaticProps, GetStaticPaths } from 'next'

import Article from '../../components/Article'
import { varlamovClient, ArticleWithText } from '../../lib/varlamovClient'

type Props = {
	article: ArticleWithText
}

export default function Post({ article }: Props) {
	return <Article {...article} />
}

export const getStaticPaths: GetStaticPaths = async function () {
	const articles = await varlamovClient.getArticles()
	const paths = articles.map(article => ({ params: { id: String(article.id) } }))
	return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const articleWithText = await varlamovClient.getArticle(Number(params!.id))

	return { props: { article: articleWithText } }
}
