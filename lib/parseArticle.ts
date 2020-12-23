export type Token =
	| { type: 'image'; width: number; height: number; src: string }
	| { type: 'link'; href: string; text: string }
	| { type: 'text'; text: string }

export function parseArticle(text: string): Token[] {
	const pattern = /(!?\[[^\]]*\]\(http.+?\))/g

	return text.split(pattern).map((part, index) => {
		const imgPattern = /!\[(?<width>\d+)x(?<height>\d+)\]\((?<src>http.+?)\)/
		const matchImg = part.match(imgPattern)

		if (matchImg?.groups) {
			return {
				type: 'image',
				width: Number(matchImg.groups.width),
				height: Number(matchImg.groups.height),
				src: matchImg.groups.src,
			}
		}

		const linkPattern = /\[(?<text>.+?)\]\((?<href>http.+?)\)/
		const matchLink = part.match(linkPattern)

		if (matchLink?.groups) {
			return { type: 'link', href: matchLink.groups.href, text: matchLink.groups.text }
		}

		return { type: 'text', text: part }
	})
}
