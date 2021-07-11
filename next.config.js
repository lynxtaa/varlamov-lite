module.exports = {
	images: {
		domains: [
			'varlamov.me',
			'www.varlamov.me',
			'ic.pics.livejournal.com',
			'farm5.staticflickr.com',
			'pp.userapi.com',
			'img1.teletype.in',
			'img2.teletype.in',
			'img3.teletype.in',
			'img4.teletype.in',
			'img5.teletype.in',
			'img6.teletype.in',
			'img7.teletype.in',
			'img8.teletype.in',
			'img9.teletype.in',
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
	},
}
