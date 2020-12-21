import { useRouter } from 'next/router'
import { ArrowLeft, ArrowRight } from 'react-feather'

import { Article } from '../lib/varlamovClient'

import Link from './Link'
import styles from './Page.module.css'

type Props = {
	initialData: Article[]
}

export default function Page({ initialData }: Props) {
	const router = useRouter()

	const pageNum = Number(router.query.pageNum) || 1
	const tag = router.query.tag

	const pathname = tag ? `/tag/${encodeURIComponent(String(tag))}/` : '/'

	const prevPage = `${pathname}page/${pageNum + 1}`
	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : null

	return (
		<div className={styles.Page}>
			{tag && <h1 className={styles.tag}>{tag}</h1>}
			<div className={styles.arrows}>
				<Link href={prevPage} title="Предыдущие статьи">
					<ArrowLeft />
				</Link>
				{nextPage ? (
					<Link href={nextPage} title="Следующие статьи">
						<ArrowRight />
					</Link>
				) : (
					<span style={{ opacity: 0.5 }}>
						<ArrowRight />
					</span>
				)}
			</div>
			{initialData.map(article => (
				<h3 key={article.id} className={styles.article}>
					<Link href={`/blog/${article.id}`}>{article.title}</Link>
				</h3>
			))}
		</div>
	)
}
