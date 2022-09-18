import '@testing-library/jest-dom/extend-expect'

import { server } from './server'

vi.mock('next/router', () => ({
	useRouter: vi.fn(),
}))

beforeAll(() =>
	server.listen({
		onUnhandledRequest: 'warn',
	}),
)

afterEach(() => {
	sessionStorage.clear()
	localStorage.clear()

	vi.useRealTimers()

	server.resetHandlers()
})

afterAll(() => server.close())

global.IntersectionObserver = class IntersectionObserver {
	observe = vi.fn()
	root = null
	rootMargin = ''
	disconnect = vi.fn()
	thresholds = []
	takeRecords = vi.fn()
	unobserve = vi.fn()
}
