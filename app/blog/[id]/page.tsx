import { type Metadata } from 'next'

import { varlamovClient } from '../../../lib/varlamovClient'

import Article from './Article'

export const dynamic = 'error'

const NUM_ARTICLES_TO_PRERENDER = 5

async function getArticle(slugId: string) {
	let id = String(slugId)
	id = /^\d+$/.test(id) ? `${id}.html` : id

	const article = await varlamovClient.getArticle(id, {
		next: {
			revalidate: 60 * 60, // every hour
		},
	})

	return article
}

export async function generateStaticParams() {
	const articles = await varlamovClient.getArticles()

	return articles.slice(0, NUM_ARTICLES_TO_PRERENDER).map(article => ({
		id: article.uri,
	}))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>
}): Promise<Metadata> {
	const { id } = await params

	const article = await getArticle(id)

	const title = `${article.title} • Блог Ильи Варламова`

	return {
		title,
		description: article.excerpt,
		openGraph: {
			description: article.excerpt,
			title,
			images:
				article.previewImageUrl !== null
					? [
							{
								// TODO: add width and height
								url: article.previewImageUrl,
							},
						]
					: [],
		},
	}
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const article = await getArticle(id)

	return <Article {...article} />
}

export const revalidate = 3600
