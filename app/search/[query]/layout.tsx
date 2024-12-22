import { type Metadata } from 'next'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ query: string }>
}): Promise<Metadata> {
	const { query } = await params
	const title = `${decodeURIComponent(query)} • Блог Ильи Варламова`
	return { title }
}

export default function Layout({ children }: { children?: React.ReactNode }) {
	return <>{children}</>
}
