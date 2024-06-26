import parse, {
	domToReact,
	type HTMLReactParserOptions,
	type DOMNode,
} from 'html-react-parser'
import Image from 'next/image'
import { useMemo } from 'react'

import Link from '../components/Link'

type Props = {
	className?: string
	text: string
}

export default function Article({ className, text }: Props) {
	const textWithImagesAndLinks = useMemo(() => {
		const options: HTMLReactParserOptions = {
			replace(node) {
				if (!('children' in node)) {
					return
				}

				switch (node.name) {
					case 'img':
						return (
							<Image
								src={node.attribs.src!}
								alt={node.attribs.alt ?? ''}
								width={Number(node.attribs.width!)}
								height={Number(node.attribs.height!)}
								className="mt-3 mb-3"
							/>
						)
					case 'a': {
						const children = domToReact(node.children as DOMNode[], options)

						const href = node.attribs.href!

						const matchPost = href.match(/https?:\/\/varlamov\.ru\/(?<postId>\w+)/)
						const matchTag = href.match(/https?:\/\/varlamov\.ru\/tag\/(?<tag>.+)$/)

						return matchPost?.groups?.postId !== undefined ? (
							<Link href={`/blog/${matchPost.groups.postId}`} underline>
								{children}
							</Link>
						) : matchTag?.groups?.tag !== undefined ? (
							<Link href={`/tag/${matchTag.groups.tag}`} underline>
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
								{domToReact(node.children as DOMNode[], options)}
							</ul>
						)
					case 'pre':
						return (
							<pre {...node.attribs} className="whitespace-pre-wrap">
								{domToReact(node.children as DOMNode[], options)}
							</pre>
						)
					case 'blockquote':
						return (
							<blockquote
								{...node.attribs}
								className="pl-4 italic border-l-4 border-gray-900 dark:border-gray-200"
							>
								{domToReact(node.children as DOMNode[], options)}
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

	return <div className={className}>{textWithImagesAndLinks}</div>
}
