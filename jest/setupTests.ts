// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { clear } from 'jest-date-mock'
import { vi } from 'vitest'

import { server } from './server'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(),
}))

vi.mock('server-only', () => ({}))

beforeAll(() => {
	server.listen({
		onUnhandledRequest: 'warn',
	})
})

afterEach(() => {
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.clear()
	}
	if (typeof localStorage !== 'undefined') {
		localStorage.clear()
	}
	clear()

	server.resetHandlers()
})

afterAll(() => {
	server.close()
})
