import Head from 'next/head'

import styles from './Article.module.css'

type Props = {
	title: string
	text: string
}

export default function Article({ title, text }: Props) {
	return (
		<article className={styles.Article}>
			<Head>
				<title>{title}</title>
			</Head>
			{text}
		</article>
	)
}
