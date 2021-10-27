import { formatDate } from '../lib/formatDate'

import Link from './Link'

type Props = {
	id: number
	uri: string
	title: string
	published_at?: string | null
}

export default function ArticleListItem({ uri, title, published_at }: Props) {
	return (
		<header className="mb-8">
			<h2 className="mb-1 text-xl">
				<Link href={`/blog/${encodeURIComponent(uri)}`}>{title}</Link>
			</h2>
			{published_at && <time className="opacity-70">{formatDate(published_at)}</time>}
		</header>
	)
}
