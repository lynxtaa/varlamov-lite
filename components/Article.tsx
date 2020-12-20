import Head from 'next/head'
import Image from 'next/image'
import { useMemo, Fragment } from 'react'

import styles from './Article.module.css'

type Props = {
	title: string
	text: string
}

export default function Article({ title, text }: Props) {
	const textWithImages: JSX.Element[] = useMemo(() => {
		const pattern = /(!\[.*\]\(http.+\))/g

		return text.split(pattern).map((part, index) => {
			const linkPattern = /!(?<alt>\[.*\])\((?<src>http.+)\)/
			const match = part.match(linkPattern)

			if (match?.groups) {
				return (
					<Image
						key={index}
						src={match.groups.src}
						alt={match.groups.alt}
						width={1000}
						height={600}
					/>
				)
			}

			return <Fragment key={index}>{part}</Fragment>
		})
	}, [text])

	return (
		<article className={styles.Article}>
			<Head>
				<title>{title}</title>
			</Head>
			{textWithImages}
		</article>
	)
}
