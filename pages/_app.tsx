import 'focus-visible'
import debounce from 'lodash/debounce'
import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import nprogress from 'nprogress'

import { Theme } from '../lib/Theme'

import 'tailwindcss/tailwind.css'
import '../styles/global.css'

// Only show nprogress after 500ms (slow loading)
// https://github.com/gaearon/whatthefuck.is/blob/24d3bfb4b6ed60d01414cb6295accd6f5d00d3b9/pages/_app.js
const start = debounce(nprogress.start, 500)

Router.events.on('routeChangeStart', start)

Router.events.on('routeChangeComplete', () => {
	start.cancel()
	nprogress.done()
	window.scrollTo(0, 0)
})

Router.events.on('routeChangeError', () => {
	start.cancel()
	nprogress.done()
})

const App = ({ Component, pageProps }: AppProps) => (
	<ThemeProvider
		defaultTheme={Theme.Dark}
		themes={Object.values(Theme)}
		enableSystem={false}
		attribute="class"
	>
		<Head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content="Блог Ильи Варламова" />

			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
			<meta name="msapplication-TileColor" content="#da532c" />
			<meta name="theme-color" content="#ffffff" />

			<link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />

			<title>Блог Ильи Варламова</title>
		</Head>
		<Component {...pageProps} />
	</ThemeProvider>
)

export default App
