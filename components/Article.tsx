import cn from 'classnames'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import Image from 'next/image'
import { useMemo } from 'react'
import { Clock } from 'react-feather'
import ReactHtmlParser, { processNodes, Transform } from 'react-html-parser'

import Page from '../layouts/Page'
import { formatDate } from '../lib/formatDate'
import { ArticleFull } from '../lib/varlamovClient'

import Icon from './Icon'
import Link from './Link'

type Props = ArticleFull

export default function Article({
	createdAt,
	excerpt,
	tags,
	title,
	text,
	previewImageUrl,
	readingTime,
}: Props) {
	const textWithImagesAndLinks = useMemo(() => {
		const transform: Transform = (node, index: number) => {
			switch (node.name) {
				case 'img':
					return (
						<Image
							key={index}
							src={node.attribs.src!}
							alt={node.attribs.alt || ''}
							width={Number(node.attribs.width!)}
							height={Number(node.attribs.height!)}
						/>
					)
				case 'a': {
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
				case 'pre':
					return (
						<pre {...node.attribs} className="whitespace-pre-wrap" key={index}>
							{processNodes(node.children, transform)}
						</pre>
					)
				case 'blockquote':
					return (
						<blockquote
							{...node.attribs}
							className="pl-4 italic border-l-4 border-gray-900 dark:border-gray-200"
							key={index}
						>
							{processNodes(node.children, transform)}
						</blockquote>
					)
				case 'iframe':
					return (
						<iframe
							{...node.attribs}
							className="w-full h-60 sm:h-96"
							key={index}
							title="Youtube видео"
						/>
					)
			}
		}

		return ReactHtmlParser(text, { transform })
	}, [text])

	return (
		<Page title={title} description={excerpt} ogImage={previewImageUrl || undefined}>
			{createdAt && (
				<time className="flex mb-1">
					{formatDate(createdAt)}
					<span className="opacity-70 inline-flex items-center ml-4">
						<Icon icon={<Clock />} className="mr-2 w-4 h-4" />
						{formatDistanceToNow(Date.now() + readingTime, { locale: ru })}
					</span>
				</time>
			)}
			<h1 className="font-bold text-3xl mb-5">{title}</h1>
			<div className="mb-4">{textWithImagesAndLinks}</div>
			<div className="flex flex-wrap">
				{tags.map((tag, i) => (
					<Link
						key={tag}
						href={`/tag/${encodeURIComponent(tag)}`}
						className={cn(
							'text-sm py-2 px-3 border rounded border-gray-700 border-solid mb-3 hover:no-underline',
							i < tags.length && 'mr-3',
						)}
					>
						{tag}
					</Link>
				))}
			</div>
		</Page>
	)
}
