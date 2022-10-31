import NextLink from 'next/link'
import { ExternalLink } from 'react-feather'

import { cn } from '../lib/cn'

import Icon from './Icon'

type Props = {
	children: React.ReactNode
	className?: string
	href: string
	isExternal?: boolean
	title?: string
	underline?: boolean
}

export default function Link({
	children,
	className,
	title,
	href,
	underline = false,
	isExternal = false,
}: Props) {
	return isExternal ? (
		<a
			href={href}
			className={cn('group hover:underline', underline && 'underline', className)}
			title={title}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
			<Icon
				icon={<ExternalLink />}
				className="inline-block ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"
			/>
		</a>
	) : (
		<NextLink
			href={href}
			className={cn('hover:underline', underline && 'underline', className)}
			title={title}
		>
			{children}
		</NextLink>
	)
}
