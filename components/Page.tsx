import { DefaultSeo } from 'next-seo'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { Sun, Moon } from 'react-feather'

import { Theme } from '../lib/Theme'
import { cn } from '../lib/cn'

import Icon from './Icon'
import Link from './Link'
import { useIsMounted } from './hooks/useIsMounted'

type Props = {
	children?: React.ReactNode
	description?: string
	ogImage?: string
	title?: string
	className?: string
}

export default function Page({
	children,
	description = 'Быстрая и лёгкая версия блога Ильи Варламова',
	ogImage = '/android-chrome-512x512.png',
	title,
	className,
}: Props) {
	const isMounted = useIsMounted()

	const { theme, setTheme } = useTheme()

	const router = useRouter()

	const fullTitle = title ? `${title} • Блог Ильи Варламова` : 'Блог Ильи Варламова'

	return (
		<div className={cn('my-0 mx-auto p-4 max-w-3xl', className)}>
			<DefaultSeo
				title={fullTitle}
				description={description}
				openGraph={{
					title,
					description,
					images: ogImage ? [{ url: ogImage }] : [],
				}}
			/>
			<header className="flex items-center mt-4 mb-8">
				{router.pathname === '/' ? (
					<h1 className="text-2xl mr-3 font-bold">Блог Ильи Варламова</h1>
				) : (
					<h3 className="text-xl mr-3 font-bold">
						<Link href="/">Блог Ильи Варламова</Link>
					</h3>
				)}
				<button
					type="button"
					className="ml-auto"
					onClick={() => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)}
					title="Переключить тему"
				>
					<Icon
						icon={isMounted ? theme === Theme.Light ? <Sun /> : <Moon /> : null}
						className="w-7 h-7"
					/>
				</button>
			</header>
			{children}
		</div>
	)
}
