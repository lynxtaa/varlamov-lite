import { formatDate } from '../lib/formatDate'

import Link from './Link'

type Props = {
	id: number
	uri: string
	title: string
	created_at?: string | null
}

export default function ArticleListItem({ id, uri, title, created_at }: Props) {
	return (
		<header className="mb-8">
			<h2 className="mb-1 text-xl">
				<Link href={`/blog/${encodeURIComponent(uri)}`}>{title}</Link>
			</h2>
			{created_at && <time className="opacity-70">{formatDate(created_at)}</time>}
		</header>
	)
}
