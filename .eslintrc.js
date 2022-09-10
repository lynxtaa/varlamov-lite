module.exports = {
	root: true,
	extends: [
		'next',
		'@lynxtaa/eslint-config',
		'@lynxtaa/eslint-config/requires-typechecking',
	],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
}
