const nextJest = require('next/jest')

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
})

module.exports = createJestConfig({
	resetMocks: true,
	testEnvironment: 'jsdom',
	roots: [
		'<rootDir>/components',
		'<rootDir>/hooks',
		'<rootDir>/lib',
		'<rootDir>/pages',
		'<rootDir>/routes',
	],
	setupFiles: ['jest-date-mock', 'whatwg-fetch'],
	setupFilesAfterEnv: ['./jest/setupTests.ts'],
})
