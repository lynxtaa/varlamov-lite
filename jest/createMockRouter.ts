import { NextRouter } from 'next/router'

export function createMockRouter(options?: Partial<NextRouter>): NextRouter {
	return {
		basePath: '/',
		pathname: '/',
		route: '/',
		query: {},
		asPath: '/',
		push: jest.fn(() => Promise.resolve(true)),
		replace: jest.fn(() => Promise.resolve(true)),
		reload: jest.fn(() => Promise.resolve(true)),
		prefetch: jest.fn(() => Promise.resolve()),
		back: jest.fn(() => Promise.resolve(true)),
		beforePopState: jest.fn(() => Promise.resolve(true)),
		isFallback: false,
		isLocaleDomain: true,
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		},
		isReady: true,
		isPreview: false,
		...options,
	}
}
