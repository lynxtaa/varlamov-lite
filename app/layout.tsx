import 'tailwindcss/tailwind.css'
import '../styles/global.css'

import { Metadata, Viewport } from 'next'

import Providers from './Providers'

const description = 'Быстрая и лёгкая версия блога Ильи Варламова'
const title = 'Блог Ильи Варламова'

export const viewport: Viewport = {
	themeColor: '#ffffff',
}

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.VERCEL_URL !== undefined
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT ?? 3000}`,
	),
	description,
	title,
	robots: 'index,follow',
	icons: {
		icon: '/favicon-32x32.png',
		apple: '/apple-touch-icon.png',
	},
	alternates: {
		types: {
			'application/rss+xml': 'https://varlamov-lite.vercel.app/feed.xml',
		},
	},
	manifest: '/site.webmanifest',
	openGraph: {
		description,
		title,
		images: [
			{
				url: '/android-chrome-512x512.png',
				width: 512,
				height: 512,
			},
		],
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
