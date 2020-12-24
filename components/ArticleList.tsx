import { useRouter } from 'next/router'
import { ArrowLeft, ArrowRight } from 'react-feather'

import { Article } from '../lib/varlamovClient'

import styles from './ArticleList.module.css'
import Icon from './Icon'
import Link from './Link'
import Page from './Page'

type Props = {
	initialData: Article[]
}

export default function ArticleList({ initialData }: Props) {
	const router = useRouter()

	const pageNum = Number(router.query.pageNum) || 1
	const tag = router.query.tag

	const pathname = tag ? `/tag/${encodeURIComponent(String(tag))}/` : '/'

	const prevPage = `${pathname}page/${pageNum + 1}`
	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : null

	return (
		<Page className={styles.ArticleList}>
			{tag && <h1 className={styles.tag}>{tag}</h1>}
			{initialData.map(article => (
				<h3 key={article.id} className={styles.article}>
					<Link href={`/blog/${article.id}`}>{article.title}</Link>
				</h3>
			))}
			<div className={styles.arrows}>
				<Link href={prevPage} title="Предыдущие статьи">
					<Icon icon={<ArrowLeft />} size={1.7} />
				</Link>
				<span>{pageNum}</span>
				{nextPage ? (
					<Link href={nextPage} title="Следующие статьи">
						<Icon icon={<ArrowRight />} size={1.7} />
					</Link>
				) : (
					<span style={{ opacity: 0.5 }}>
						<Icon icon={<ArrowRight />} size={1.7} />
					</span>
				)}
			</div>
		</Page>
	)
}
