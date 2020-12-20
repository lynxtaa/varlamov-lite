import Head from 'next/head'
import Image from 'next/image'
import { useMemo, Fragment } from 'react'
import { ArrowLeft } from 'react-feather'

import styles from './Article.module.css'
import Link from './Link'

type Props = {
	title: string
	text: string
}

export default function Article({ title, text }: Props) {
	const textWithImages: JSX.Element[] = useMemo(() => {
		const pattern = /(!\[.*\]\(http.+\))/g

		return text.split(pattern).map((part, index) => {
			const linkPattern = /!\[(?<alt>.*)\]\((?<src>http.+)\)/
			const match = part.match(linkPattern)

			if (match?.groups) {
				return (
					<Image
						key={index}
						src={match.groups.src}
						alt={match.groups.alt}
						width={1000}
						height={600}
						className={styles.Image}
					/>
				)
			}

			return <Fragment key={index}>{part}</Fragment>
		})
	}, [text])

	return (
		<article className={styles.Article}>
			<Link href="/">
				<ArrowLeft />
			</Link>
			<Head>
				<title>{title}</title>
			</Head>
			<h1>{title}</h1>
			{textWithImages}
		</article>
	)
}
