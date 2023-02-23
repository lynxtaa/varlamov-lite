const nextJest = require('next/jest')

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
})

const isCI = process.env.CI !== undefined

module.exports = createJestConfig({
	resetMocks: true,
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/app', '<rootDir>/components', '<rootDir>/hooks', '<rootDir>/lib'],
	coverageReporters: isCI
		? ['html', 'text', 'text-summary', 'cobertura']
		: ['html', 'text-summary'],
	snapshotFormat: {
		escapeString: false,
		printBasicPrototype: false,
	},
	setupFiles: ['jest-date-mock', 'whatwg-fetch'],
	setupFilesAfterEnv: ['./jest/setupTests.ts'],
})
