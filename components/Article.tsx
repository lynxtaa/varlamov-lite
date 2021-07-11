import cn from 'classnames'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser'
import Image from 'next/image'
import { useMemo } from 'react'
import { Clock } from 'react-feather'

import Page from '../layouts/Page'
import { formatDate } from '../lib/formatDate'
import { ArticleFull } from '../lib/varlamovClient'

import Icon from './Icon'
import Link from './Link'

type Props = ArticleFull

export default function Article({
	created_at,
	excerpt,
	tags,
	title,
	text,
	previewImageUrl,
	readingTime,
}: Props) {
	const textWithImagesAndLinks = useMemo(() => {
		const options: HTMLReactParserOptions = {
			replace(node: any) {
				switch (node.name) {
					case 'img':
						return (
							<Image
								src={node.attribs.src!}
								alt={node.attribs.alt || ''}
								width={Number(node.attribs.width!)}
								height={Number(node.attribs.height!)}
							/>
						)
					case 'a': {
						const children = domToReact(node.children, options)

						const href = node.attribs.href!

						const matchPost = href.match(/https?:\/\/varlamov\.ru\/(?<postId>\d+)\.html/)
						const matchTag = href.match(/https?:\/\/varlamov\.ru\/tag\/(?<tag>.+)$/)

						return matchPost?.groups ? (
							<Link href={`/blog/${matchPost.groups.postId}`} underline>
								{children}
							</Link>
						) : matchTag?.groups ? (
							<Link href={`/tag/${matchTag.groups.tag!}`} underline>
								{children}
							</Link>
						) : (
							<Link href={href} isExternal underline>
								{children}
							</Link>
						)
					}
					case 'ul':
						return (
							<ul {...node.attribs} className="list-disc list-inside">
								{domToReact(node.children, options)}
							</ul>
						)
					case 'pre':
						return (
							<pre {...node.attribs} className="whitespace-pre-wrap">
								{domToReact(node.children, options)}
							</pre>
						)
					case 'blockquote':
						return (
							<blockquote
								{...node.attribs}
								className="pl-4 italic border-l-4 border-gray-900 dark:border-gray-200"
							>
								{domToReact(node.children, options)}
							</blockquote>
						)
					case 'iframe':
						return (
							<iframe
								{...node.attribs}
								className="w-full h-60 sm:h-96"
								title="Youtube видео"
							/>
						)
				}
			},
		}

		return parse(text, options)
	}, [text])

	return (
		<Page title={title} description={excerpt} ogImage={previewImageUrl || undefined}>
			{created_at && (
				<time className="flex mb-1">
					{formatDate(created_at)}
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
						href={`/tag/${tag}`}
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
