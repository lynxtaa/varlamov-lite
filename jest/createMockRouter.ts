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
		reload: jest.fn(),
		prefetch: jest.fn(() => Promise.resolve()),
		back: jest.fn(),
		forward: jest.fn(),
		beforePopState: jest.fn(),
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
