import { Element as DomHandlerElement } from 'domhandler'
import Image from 'next/image'
import { useMemo } from 'react'
import ReactHtmlParser, { processNodes } from 'react-html-parser'

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
		function transform(node: DomHandlerElement, index: number) {
			if (node.name === 'img') {
				return (
					<Image
						key={index}
						src={node.attribs.src!}
						alt={node.attribs.alt || ''}
						width={Number(node.attribs.width!)}
						height={Number(node.attribs.height!)}
					/>
				)
			}

			if (node.name === 'a') {
				const children = processNodes(node.children, transform)

				const href = node.attribs.href!

				const matchPost = href.match(/https?:\/\/varlamov\.ru\/(?<postId>\d+)\.html/)
				const matchTag = href.match(/https?:\/\/varlamov\.ru\/tag\/(?<tag>.+)$/)

				return matchPost?.groups ? (
					<Link key={index} href={`/blog/${matchPost.groups.postId}`} underline>
						{children}
					</Link>
				) : matchTag?.groups ? (
					<Link
						key={index}
						href={`/tag/${encodeURIComponent(matchTag.groups.tag!)}`}
						underline
					>
						{children}
					</Link>
				) : (
					<Link key={index} href={href} isExternal underline>
						{children}
					</Link>
				)
			}
		}

		return ReactHtmlParser(text, { transform })
	}, [text])

	return (
		<Page
			className={styles.Article}
			title={title}
			description={excerpt}
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
