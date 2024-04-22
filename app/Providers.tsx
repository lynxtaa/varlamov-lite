import { ThemeProvider } from 'next-themes'

import { Theme } from '../lib/Theme'

export default function Providers({ children }: { children?: React.ReactNode }) {
	return (
		<ThemeProvider
			defaultTheme={Theme.Dark}
			themes={Object.values(Theme)}
			enableSystem={false}
			attribute="class"
		>
			{children}
		</ThemeProvider>
	)
}
