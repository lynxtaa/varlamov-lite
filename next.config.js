// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
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
}

module.exports = withBundleAnalyzer(config)
