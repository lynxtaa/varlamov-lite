import { ArrowLeft, ArrowRight } from 'react-feather'

import Icon from './Icon'
import Link from './Link'

type Props = {
	prevPage?: string
	nextPage?: string
	pageNum: number
}

export function Pagination({ prevPage, nextPage, pageNum }: Props) {
	const rightIcon = <Icon icon={<ArrowRight />} className="w-7 h-7" />
	const leftIcon = <Icon icon={<ArrowLeft />} className="w-7 h-7" />

	return (
		<div className="flex items-center sticky bottom-0 py-4 space-x-6 justify-end bg-gray-50 dark:bg-gray-900">
			{prevPage !== undefined ? (
				<Link href={prevPage} title="Предыдущая страница">
					{leftIcon}
				</Link>
			) : (
				<span className="opacity-50">{leftIcon}</span>
			)}
			{pageNum !== undefined && <span>{pageNum}</span>}
			{nextPage !== undefined ? (
				<Link href={nextPage} title="Следующая страница">
					{rightIcon}
				</Link>
			) : (
				<span className="opacity-50">{rightIcon}</span>
			)}
		</div>
	)
}
