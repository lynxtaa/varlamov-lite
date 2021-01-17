import cn from 'classnames'
import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Sun, Moon } from 'react-feather'

import { useTheme, Theme } from '../lib/theme'

import Icon from './Icon'
import Link from './Link'
import styles from './Page.module.css'

type Props = {
	children?: React.ReactNode
	className?: string
	description?: string
	ogImage?: string
	title?: string
}

export default function Page({
	children,
	className,
	description = 'Быстрая и лёгкая версия блога Ильи Варламова',
	ogImage = '/android-chrome-512x512.png',
	title,
}: Props) {
	const { theme, toggle } = useTheme()

	const router = useRouter()

	const fullTitle = title ? `${title} • Блог Ильи Варламова` : 'Блог Ильи Варламова'

	return (
		<div className={cn(styles.Page, className)}>
			<DefaultSeo
				title={fullTitle}
				description={description}
				openGraph={{
					title,
					description,
					images: ogImage ? [{ url: ogImage }] : [],
				}}
			/>
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
