import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import Page from '../components/Page'
import Spinner from '../components/Spinner'
import { Article, varlamovClient } from '../lib/varlamovClient'

type Props = {
	initialData: Article[]
}

export default function PageNum({ initialData }: Props) {
	const router = useRouter()

	if (router.isFallback) {
		return <Spinner />
	}

	return <Page initialData={initialData} />
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [{ params: { pageNum: '2' } }],
	fallback: true,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const initialData = await varlamovClient.getArticles({
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		pageNum: Number(params!.pageNum),
	})

	return {
		props: { initialData },
		revalidate: 30 * 60, // every 30 minutes
	}
}
