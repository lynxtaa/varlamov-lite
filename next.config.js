const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{ hostname: 'varlamov.me' },
			{ hostname: 'www.varlamov.me' },
			{ hostname: '*.pics.livejournal.com' },
			{ hostname: '*.staticflickr.com' },
			{ hostname: 'pp.userapi.com' },
			{ hostname: 'teletype.in' },
			{ hostname: 'img*.teletype.in' },
			{ hostname: 'telegra.ph' },
		],
	},
	async rewrites() {
		return [{ source: '/feed.xml', destination: '/api/feed.xml' }]
	},
}

module.exports = withBundleAnalyzer(config)
