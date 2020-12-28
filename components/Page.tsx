import cn from 'classnames'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Sun, Moon } from 'react-feather'

import { useTheme, Theme } from '../lib/theme'

import Icon from './Icon'
import Link from './Link'
import styles from './Page.module.css'

type Props = {
	children?: React.ReactNode
	className?: string
	ogDescription?: string
	ogImage?: string
	title?: string
}

export default function Page({
	children,
	className,
	ogDescription,
	ogImage,
	title,
}: Props) {
	const { theme, toggle } = useTheme()

	const router = useRouter()

	const fullTitle = title ? `${title} • Блог Ильи Варламова` : null

	return (
		<div className={cn(styles.Page, className)}>
			<Head>
				{ogDescription && <meta property="og:description" content={ogDescription} />}
				{ogImage && <meta property="og:image" content={ogImage} />}
				{fullTitle && (
					<>
						<meta property="og:title" content={fullTitle} />
						<title>{fullTitle}</title>
					</>
				)}
			</Head>
			<header className={styles.header}>
				{router.pathname === '/' ? (
					<h1>Блог Ильи Варламова</h1>
				) : (
					<h3>
						<Link href="/">Блог Ильи Варламова</Link>
					</h3>
				)}
				<button type="button" onClick={toggle} title="Переключить тему">
					<Icon icon={theme === Theme.Dark ? <Moon /> : <Sun />} size={1.7} />
				</button>
			</header>
			{children}
		</div>
	)
}
