import { Article } from '../lib/varlamovClient'

import Link from './Link'
import styles from './Page.module.css'

type Props = {
	initialData: Article[]
}

export default function Page({ initialData }: Props) {
	return (
		<div className={styles.page}>
			{initialData.map(article => (
				<h3 key={article.id} className={styles.article}>
					<Link href={`/blog/${article.id}`}>{article.title}</Link>
				</h3>
			))}
		</div>
	)
}
