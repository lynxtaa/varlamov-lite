import cn from 'classnames'
import NextLink, { LinkProps } from 'next/link'

import styles from './Link.module.css'

type Props = LinkProps & {
	children: React.ReactNode
	className?: string
}

export default function Link({ children, className, ...rest }: Props) {
	return (
		<NextLink {...rest}>
			{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			<a className={cn(styles.Link, className)}>{children}</a>
		</NextLink>
	)
}
