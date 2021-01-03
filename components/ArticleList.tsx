import { useRouter } from 'next/router'
import { ArrowLeft, ArrowRight } from 'react-feather'

import { formatDate } from '../lib/formatDate'
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

	const prevPage = initialData.length > 0 ? `${pathname}page/${pageNum + 1}` : null
	const nextPage =
		pageNum > 1 ? (pageNum > 2 ? `${pathname}page/${pageNum - 1}` : pathname) : null

	const rightIcon = <Icon icon={<ArrowRight />} size={1.7} />
	const leftIcon = <Icon icon={<ArrowLeft />} size={1.7} />

	return (
		<Page title={tag ? String(tag) : undefined} className={styles.ArticleList}>
			{tag && <h1 className={styles.tag}>{tag}</h1>}
			{initialData.length > 0 ? (
				initialData.map(article => (
					<header key={article.id} className={styles.article}>
						<h3>
							<Link href={`/blog/${article.id}`}>{article.title}</Link>
						</h3>
						{article.createdAt && <time>{formatDate(article.createdAt)}</time>}
					</header>
				))
			) : (
				<header className={styles.article}>
					<h3>Ничего не найдено</h3>
				</header>
			)}
			<div className={styles.arrows}>
				{prevPage ? (
					<Link href={prevPage} title="Предыдущая страница">
						{leftIcon}
					</Link>
				) : (
					<span style={{ opacity: 0.5 }}>{leftIcon}</span>
				)}
				<span className={styles.pageNum}>{pageNum}</span>
				{nextPage ? (
					<Link href={nextPage} title="Следующая страница">
						{rightIcon}
					</Link>
				) : (
					<span style={{ opacity: 0.5 }}>{rightIcon}</span>
				)}
			</div>
		</Page>
	)
}
