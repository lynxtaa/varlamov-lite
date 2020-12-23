import Head from 'next/head'
import Image from 'next/image'
import { useMemo, Fragment } from 'react'
import { ArrowLeft } from 'react-feather'

import { parseArticle } from '../lib/parseArticle'
import { ArticleFull } from '../lib/varlamovClient'

import styles from './Article.module.css'
import Icon from './Icon'
import Link from './Link'

type Props = ArticleFull

export default function Article({ tags, title, text }: Props) {
	const textWithImagesAndLinks: JSX.Element[] = useMemo(() => {
		const tokens = parseArticle(text)

		return tokens.map((token, index) => {
			switch (token.type) {
				case 'image':
					return (
						<div key={index} className={styles.imageWrap}>
							<Image
								src={token.src}
								alt=""
								width={token.width}
								height={token.height}
								className={styles.Image}
							/>
						</div>
					)
				case 'link': {
					const matchHref = token.href.match(
						/https?:\/\/varlamov\.ru\/(?<postId>\d+)\.html/,
					)

					return matchHref?.groups ? (
						<Link key={index} href={`/blog/${matchHref.groups.postId}`} underline>
							{token.text}
						</Link>
					) : (
						<Link key={index} href={token.href} isExternal underline>
							{token.text}
						</Link>
					)
				}
				case 'text':
					return <Fragment key={index}>{token.text}</Fragment>
				default:
					throw new Error()
			}
		})
	}, [text])

	return (
		<article className={styles.Article}>
			<div className={styles.backArrow}>
				<Link href="/">
					<Icon icon={<ArrowLeft />} size={2} />
					<span>на главную</span>
				</Link>
			</div>
			<Head>
				<title>{title}</title>
			</Head>
			<h1>{title}</h1>
			<div className={styles.text}>{textWithImagesAndLinks}</div>
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
