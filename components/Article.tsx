import Image from 'next/image'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'

import { formatDate } from '../lib/formatDate'
import { ArticleFull } from '../lib/varlamovClient'

import styles from './Article.module.css'
import Link from './Link'
import Page from './Page'

type Props = ArticleFull

export default function Article({
	createdAt,
	excerpt,
	tags,
	title,
	text,
	previewImageUrl,
}: Props) {
	const textWithImagesAndLinks = useMemo(() => {
		const renderers: { [nodeType: string]: React.ElementType } = {
			code: ({ value }) => <pre>{value.trim()}</pre>,

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
		<Page
			className={styles.Article}
			title={title}
			ogDescription={excerpt}
			ogImage={previewImageUrl || undefined}
		>
			{createdAt && <time>{formatDate(createdAt)}</time>}
			<h1>{title}</h1>
			<div className={styles.text}>{textWithImagesAndLinks}</div>
			<div className={styles.tags}>
				{tags.map(tag => (
					<Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
						{tag}
					</Link>
				))}
			</div>
		</Page>
	)
}
