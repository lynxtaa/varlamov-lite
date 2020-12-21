import Head from 'next/head'
import Image from 'next/image'
import { useMemo, Fragment } from 'react'
import { ArrowLeft } from 'react-feather'

import { ArticleFull } from '../lib/varlamovClient'

import styles from './Article.module.css'
import Link from './Link'

type Props = ArticleFull

export default function Article({ tags, title, text }: Props) {
	const textWithImages: JSX.Element[] = useMemo(() => {
		const pattern = /(!\[.*\]\(http.+\))/g

		return text.split(pattern).map((part, index) => {
			const linkPattern = /!\[(?<width>\d+)x(?<height>\d+)\]\((?<src>http.+)\)/
			const match = part.match(linkPattern)

			if (match?.groups) {
				return (
					<div key={index} className={styles.imageWrap}>
						<Image
							src={match.groups.src}
							alt=""
							width={match.groups.width}
							height={match.groups.height}
							className={styles.Image}
						/>
					</div>
				)
			}

			return <Fragment key={index}>{part.trim()}</Fragment>
		})
	}, [text])

	return (
		<article className={styles.Article}>
			<div className={styles.backArrow}>
				<Link href="/">
					<ArrowLeft /> <span style={{ verticalAlign: 'top' }}>на главную</span>
				</Link>
			</div>
			<Head>
				<title>{title}</title>
			</Head>
			<h1>{title}</h1>
			<div className={styles.text}>{textWithImages}</div>
			<div className={styles.tags}>
				{tags.map(tag => (
					<Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
						{tag}
					</Link>
				))}
			</div>
		</article>
	)
}
