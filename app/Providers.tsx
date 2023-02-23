'use client'

import 'focus-visible'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

import { Theme } from '../lib/Theme'

export default function Providers({ children }: { children?: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<ThemeProvider
			defaultTheme={Theme.Dark}
			themes={Object.values(Theme)}
			enableSystem={false}
			attribute="class"
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ThemeProvider>
	)
}
