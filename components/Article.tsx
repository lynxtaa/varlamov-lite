import { format as formatDate, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import Head from 'next/head'
import Image from 'next/image'
import { useMemo } from 'react'
import { ArrowLeft } from 'react-feather'
import ReactMarkdown from 'react-markdown'

import { ArticleFull } from '../lib/varlamovClient'

import styles from './Article.module.css'
import Icon from './Icon'
import Link from './Link'

type Props = ArticleFull

export default function Article({ createdAt, tags, title, text }: Props) {
	const textWithImagesAndLinks = useMemo(() => {
		const renderers: { [nodeType: string]: React.ElementType } = {
			image({ alt, src }) {
				const [width, height] = alt.split('x')

				return (
					<div className={styles.imageWrap}>
						<Image
							src={src}
							alt=""
							width={Number(width)}
							height={Number(height)}
							className={styles.Image}
						/>
					</div>
				)
			},
			link({ href, children }) {
				const matchHref = href.match(/https?:\/\/varlamov\.ru\/(?<postId>\d+)\.html/)

				return matchHref?.groups ? (
					<Link href={`/blog/${matchHref.groups.postId}`} underline>
						{children}
					</Link>
				) : (
					<Link href={href} isExternal underline>
						{children}
					</Link>
				)
			},
			list: ({ children }) => children,
			listItem: ({ children, ordered, index }) =>
				ordered && typeof index === 'number' ? (
					<>
						{index + 1}. {children}
					</>
				) : (
					children
				),
		}

		return <ReactMarkdown renderers={renderers}>{text}</ReactMarkdown>
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
			{createdAt && (
				<time>{formatDate(parseISO(createdAt), 'd MMMM yyyy', { locale: ru })}</time>
			)}
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
