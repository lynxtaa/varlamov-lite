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

	return (
		<div className={styles.Page}>
			<div className={styles.arrows}>
				<Link href={`/${pageNum + 1}`} title="Предыдущие статьи">
					<ArrowLeft />
				</Link>
				{pageNum > 1 ? (
					<Link href={pageNum > 2 ? `/${pageNum - 1}` : '/'} title="Следующие статьи">
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
