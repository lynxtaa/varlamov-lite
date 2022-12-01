// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import { clear } from 'jest-date-mock'

import { server } from './server'

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

beforeAll(() =>
	server.listen({
		onUnhandledRequest: 'warn',
	}),
)

afterEach(() => {
	sessionStorage.clear()
	localStorage.clear()
	clear()

	server.resetHandlers()
})

afterAll(() => server.close())

global.IntersectionObserver = class IntersectionObserver {
	observe = jest.fn()
	root = null
	rootMargin = ''
	disconnect = jest.fn()
	thresholds = []
	takeRecords = jest.fn()
	unobserve = jest.fn()
}
