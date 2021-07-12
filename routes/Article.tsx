import cn from 'classnames'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useRouter } from 'next/router'
import { Clock } from 'react-feather'

import ArticleBody from '../components/ArticleBody'
import Icon from '../components/Icon'
import Link from '../components/Link'
import Spinner from '../components/Spinner'
import Page from '../components/layouts/Page'
import { formatDate } from '../lib/formatDate'
import { ArticleFull } from '../lib/varlamovClient'

export type Props = ArticleFull

export default function Article({
	published_at,
	excerpt,
	tags,
	title,
	text,
	previewImageUrl,
	readingTime,
}: Props) {
	const router = useRouter()

	if (router.isFallback) {
		return <Spinner />
	}

	return (
		<Page title={title} description={excerpt} ogImage={previewImageUrl || undefined}>
			{published_at && (
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
