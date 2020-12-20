import { AppProps } from 'next/app'
import Head from 'next/head'
import { StrictMode } from 'react'

import 'focus-visible'

import '../styles/global.css'

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
