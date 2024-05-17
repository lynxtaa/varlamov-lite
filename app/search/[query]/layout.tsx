import { type Metadata } from 'next'

export async function generateMetadata({
	params,
}: {
	params: { query: string }
}): Promise<Metadata> {
	const title = `${decodeURIComponent(params.query)} • Блог Ильи Варламова`
	return { title }
}

export default function Layout({ children }: { children?: React.ReactNode }) {
	return <>{children}</>
}
