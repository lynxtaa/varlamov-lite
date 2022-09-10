import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as _render, RenderOptions } from '@testing-library/react'
import React, { useState } from 'react'

function Wrapper({ children }: { children?: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export const renderWithProviders = (el: React.ReactElement, options?: RenderOptions) =>
	_render(el, { wrapper: Wrapper, ...options })
