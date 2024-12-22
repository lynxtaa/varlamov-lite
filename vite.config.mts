import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const isCi = process.env.CI !== undefined

export default defineConfig({
	test: {
		mockReset: true,
		environment: 'jsdom',
		include: ['**/*.test.{ts,tsx}'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['html', isCi ? 'text' : 'text-summary'],
			all: true,
			include: ['**/*.ts'],
		},
		snapshotFormat: {
			escapeString: false,
			printBasicPrototype: false,
		},
		setupFiles: ['jest-date-mock', 'whatwg-fetch', './jest/setupTests.ts'],
	},
	plugins: [tsconfigPaths(), react()],
})
