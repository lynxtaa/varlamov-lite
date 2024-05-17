import { base64urlToDecimal, decimalToBase64url } from './decimal-base64url'

it.each([
	{ decimal: 16777215, base64url: '____' },
	{ decimal: 100, base64url: 'ZA' },
])('converts $decimal to $base64url', ({ decimal, base64url }) => {
	expect(decimalToBase64url(decimal)).toBe(base64url)
	expect(base64urlToDecimal(base64url)).toBe(decimal)
})
