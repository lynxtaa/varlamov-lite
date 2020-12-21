module.exports = {
	i18n: {
		locales: ['ru'],
		defaultLocale: 'ru',
	},
	images: {
		domains: ['varlamov.me', 'ic.pics.livejournal.com'],
	},
	async redirects() {
		return [{ source: '/:id.html', destination: '/blog/:id', permanent: true }]
	},
	reactStrictMode: true,
}
