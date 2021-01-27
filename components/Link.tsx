import cn from 'classnames'
import NextLink from 'next/link'

import styles from './Link.module.css'

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
	underline,
	isExternal,
}: Props) {
	return isExternal ? (
		<a
			href={href}
			className={cn(styles.Link, underline && styles.underline, className)}
			title={title}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</a>
	) : (
		<NextLink href={href}>
			{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			<a
				className={cn(styles.Link, underline && styles.underline, className)}
				title={title}
			>
				{children}
			</a>
		</NextLink>
	)
}
