import debounce from 'lodash.debounce'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import nprogress from 'nprogress'
import { StrictMode } from 'react'

import 'focus-visible'

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
	<StrictMode>
		<Head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta
				name="description"
				content="Только крокодилы спасут эту страну от мудаков! – Варламов.ру – ЖЖ"
			/>
			<title>Varlamov</title>
		</Head>
		<Component {...pageProps} />
	</StrictMode>
)

export default App
