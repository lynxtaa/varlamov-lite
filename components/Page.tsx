import cn from 'classnames'
import Head from 'next/head'
import { Sun, Moon } from 'react-feather'

import { useTheme, Theme } from '../lib/theme'

import Icon from './Icon'
import styles from './Page.module.css'

type Props = {
	children?: React.ReactNode
	className?: string
	title?: string
}

export default function Page({ children, className, title }: Props) {
	const { theme, toggle } = useTheme()

	return (
		<div className={cn(styles.Page, className)}>
			{title && (
				<Head>
					<title>{title}</title>
				</Head>
			)}
			<button
				type="button"
				className={styles.themeButton}
				onClick={toggle}
				title="Переключить тему"
			>
				<Icon icon={theme === Theme.Dark ? <Moon /> : <Sun />} size={1.7} />
			</button>
			{children}
		</div>
	)
}
