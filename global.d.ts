/// <reference types="vitest/globals" />
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
	namespace jest {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Matchers<R = void>
			extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
	}
}
