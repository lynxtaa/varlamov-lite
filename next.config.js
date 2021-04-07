module.exports = {
	images: {
		domains: [
			'varlamov.me',
			'www.varlamov.me',
			'ic.pics.livejournal.com',
			'farm5.staticflickr.com',
			'pp.userapi.com',
		],
	},
	async redirects() {
		return [{ source: '/:id.html', destination: '/blog/:id', permanent: true }]
	},
	async rewrites() {
		return [{ source: '/feed.xml', destination: '/api/feed.xml' }]
	},
	reactStrictMode: true,
	future: {
		strictPostcssConfiguration: true,
		webpack5: true,
	},
}
