module.exports = {
	content: ['./components/**/*.tsx', './pages/**/*.tsx', './routes/**/*.tsx'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				gray: {
					50: '#eff2f6',
					100: '#d1d7de',
					200: '#b3bcc9',
					300: '#93a1b6',
					400: '#7486a2',
					500: '#5a6c89',
					600: '#46546a',
					700: '#333c4b',
					800: '#1f242d',
					900: '#090c10',
				},
			},
			keyframes: {
				spinZ: {
					from: { transform: 'rotateZ(0deg)' },
					to: { transform: 'rotateZ(360deg)' },
				},
			},
			animation: {
				spinZ: 'spinZ 10s infinite linear',
			},
		},
	},
	plugins: [],
}
