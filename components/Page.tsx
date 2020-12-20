import Link from 'next/link'

import { Article } from '../lib/varlamovClient'

import styles from './Page.module.css'

type Props = {
	initialData: Article[]
}

export default function Page({ initialData }: Props) {
	return (
		<div className={styles.page}>
			{initialData.map(article => (
				<h3 key={article.id} className={styles.article}>
					<Link href={`/blog/${encodeURIComponent(article.id)}`}>
						<a>{article.title}</a>
					</Link>
				</h3>
			))}
		</div>
	)
}
