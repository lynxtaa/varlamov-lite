import { FlatCompat } from '@eslint/eslintrc'
import eslintConfig from '@lynxtaa/eslint-config'
import requiresTypechecking from '@lynxtaa/eslint-config/requires-typechecking'

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
})

export default [
	// TODO: support 'next' config
	...eslintConfig,
	...requiresTypechecking,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['*.js', '*.mjs', 'vite.config.mts'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...compat.config({
		extends: ['plugin:react-hooks/recommended'],
	}),
	{
		ignores: ['.next', 'coverage'],
	},
]
