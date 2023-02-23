'use client'

import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sun, Moon, Search, ChevronRight } from 'react-feather'

import { useIsMounted } from '../../hooks/useIsMounted'
import { Theme } from '../../lib/Theme'
import { cn } from '../../lib/cn'
import Icon from '../Icon'
import Link from '../Link'

type Props = {
	children?: React.ReactNode
	className?: string
	isHome?: boolean
}

export default function Page({ isHome = false, children, className }: Props) {
	const [searchBarVisible, setSearchBarVisible] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	const isMounted = useIsMounted()

	const { theme, setTheme } = useTheme()

	const router = useRouter()

	return (
		<div className={cn('my-0 mx-auto p-4 max-w-3xl', className)}>
			<header className="flex flex-col mt-4 mb-8">
				<div className="flex items-center">
					{isHome ? (
						<h1 className="text-2xl mr-3 font-bold">Блог Ильи Варламова</h1>
					) : (
						<h3 className="text-xl mr-3 font-bold">
							<Link href="/">Блог Ильи Варламова</Link>
						</h3>
					)}
					<button
						type="button"
						className="ml-auto"
						onClick={() => setSearchBarVisible(!searchBarVisible)}
						title="Поиск"
					>
						<Icon icon={<Search />} className="w-7 h-7" />
					</button>
					<button
						type="button"
						className="ml-4"
						onClick={() => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)}
						title="Переключить тему"
					>
						<Icon
							icon={isMounted ? theme === Theme.Light ? <Sun /> : <Moon /> : null}
							className="w-7 h-7"
						/>
					</button>
				</div>
				{searchBarVisible && (
					<form
						className="mt-4"
						onSubmit={event => {
							event.preventDefault()
							void router.push(`/search/${encodeURIComponent(searchQuery)}`)
							setSearchBarVisible(false)
						}}
					>
						<label htmlFor="search-query" className="block">
							Поиск
						</label>
						<div className="flex items-center">
							<input
								className="border border-r-0 border-gray-700 px-2 h-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex-grow md:flex-grow-0 md:w-2/4"
								type="text"
								aria-label="Поиск"
								id="search-query"
								name="search-query"
								autoFocus
								value={searchQuery}
								onChange={event => setSearchQuery(event.target.value)}
							/>
							<button
								type="submit"
								title="Отправить"
								className="border border-gray-700 border-l-0 px-2 h-10"
							>
								<Icon icon={<ChevronRight />} className="w-6 h-6" />
							</button>
						</div>
					</form>
				)}
			</header>
			{children}
		</div>
	)
}
