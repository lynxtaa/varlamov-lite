import cn from 'classnames'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Clock } from 'react-feather'

import ArticleBody from '../../../components/ArticleBody'
import Icon from '../../../components/Icon'
import Link from '../../../components/Link'
import Page from '../../../components/layouts/Page'
import { formatDate } from '../../../lib/formatDate'
import { type ArticleFull } from '../../../lib/varlamovClient'

export type Props = ArticleFull

export default function Article({
	published_at,
	tags,
	title,
	text,
	readingTime,
	topics,
}: Props) {
	return (
		<Page>
			{topics.length > 0 && (
				<div className="flex flex-wrap">
					{topics.map(({ name }, i) => (
						<div
							key={name}
							className={cn(
								'py-1 px-3 border rounded-md border-gray-700 border-solid mb-3 cursor-default bg-gray-900 text-gray-50 dark:bg-gray-200 dark:text-gray-900 font-semibold',
								i < tags.length && 'mr-3',
							)}
						>
							{name}
						</div>
					))}
				</div>
			)}
			{published_at !== null && (
				<time className="flex mb-1">
					{formatDate(published_at)}
					<span className="opacity-70 inline-flex items-center ml-4">
						<Icon icon={<Clock />} className="mr-2 w-4 h-4" />
						{formatDistanceToNow(Date.now() + readingTime, { locale: ru })}
					</span>
				</time>
			)}
			<h1 className="font-bold text-3xl mb-5">{title}</h1>
			<ArticleBody text={text} className="mb-4" />
			<div className="flex flex-wrap">
				{tags
					.map(tag => `#${tag}`)
					.map((tag, i) => (
						<Link
							key={tag}
							href={`/search/${encodeURIComponent(tag)}`}
							className={cn(
								'text-sm py-2 px-3 border rounded border-gray-700 border-solid mb-3 hover:no-underline',
								i < tags.length && 'mr-3',
							)}
						>
							{tag}
						</Link>
					))}
			</div>
		</Page>
	)
}
