export function getYoutubeVideoId(url: string): string | null {
	const { searchParams, pathname, host } = new URL(url)

	if (host === 'www.youtube.com' || host === 'youtube.com') {
		if (pathname === '/watch') {
			const vidId = searchParams.get('v')
			if (vidId !== null && vidId !== '') {
				// https://www.youtube.com/watch?v=9kTpmziuEPk
				return vidId
			}
		} else if (pathname.startsWith('/embed/')) {
			// https://www.youtube.com/embed/fw5hbjqBiSA
			return pathname.replace('/embed/', '')
		}
	} else if (host === 'youtu.be') {
		// https://youtu.be/Pb5LZxoXQW8
		return pathname.replace(/^\//, '')
	}

	return null
}
