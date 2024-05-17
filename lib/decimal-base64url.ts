function bytesArray(n: number): ArrayBuffer {
	const a = []
	a.unshift(n & 255)
	while (n >= 256) {
		// eslint-disable-next-line no-param-reassign
		n = n >>> 8
		a.unshift(n & 255)
	}
	return new Uint8Array(a).buffer
}

export function decimalToBase64url(n: number): string {
	return Buffer.from(bytesArray(n)).toString('base64url')
}

export function base64urlToDecimal(base64: string): number {
	return Number.parseInt(Buffer.from(base64, 'base64url').toString('hex'), 16)
}
