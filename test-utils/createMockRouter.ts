import { NextRouter } from 'next/router'

export function createMockRouter(options?: Partial<NextRouter>): NextRouter {
	return {
		basePath: '/',
		pathname: '/',
		route: '/',
		query: {},
		asPath: '/',
		push: vi.fn(() => Promise.resolve(true)),
		replace: vi.fn(() => Promise.resolve(true)),
		reload: vi.fn(),
		prefetch: vi.fn(() => Promise.resolve()),
		back: vi.fn(),
		beforePopState: vi.fn(),
		isFallback: false,
		isLocaleDomain: true,
		events: {
			on: vi.fn(),
			off: vi.fn(),
			emit: vi.fn(),
		},
		isReady: true,
		isPreview: false,
		...options,
	}
}
