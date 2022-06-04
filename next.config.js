const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	images: {
		domains: [
			'varlamov.me',
			'www.varlamov.me',
			'ic.pics.livejournal.com',
			'farm5.staticflickr.com',
			'pp.userapi.com',
			'teletype.in',
			'img1.teletype.in',
			'img2.teletype.in',
			'img3.teletype.in',
			'img4.teletype.in',
			'img5.teletype.in',
			'img6.teletype.in',
			'img7.teletype.in',
			'img8.teletype.in',
			'img9.teletype.in',
			'telegra.ph',
		],
	},
	async rewrites() {
		return [{ source: '/feed.xml', destination: '/api/feed.xml' }]
	},
	reactStrictMode: true,
	future: {
		strictPostcssConfiguration: true,
	},
}

module.exports = withBundleAnalyzer(config)
