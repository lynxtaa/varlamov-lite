module.exports = {
	images: {
		domains: ['varlamov.me', 'www.varlamov.me', 'ic.pics.livejournal.com'],
	},
	async redirects() {
		return [{ source: '/:id.html', destination: '/blog/:id', permanent: true }]
	},
	async rewrites() {
		return [{ source: '/feed.xml', destination: '/api/feed.xml' }]
	},
	reactStrictMode: true,
}
