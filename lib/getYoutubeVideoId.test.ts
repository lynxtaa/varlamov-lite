import { getYoutubeVideoId } from './getYoutubeVideoId'

it.each([
	['https://www.youtube.com/watch?v=9kTpmziuEPk', '9kTpmziuEPk'],
	['https://youtube.com/watch?v=9kTpmziuEPk', '9kTpmziuEPk'],
	['https://www.youtube.com/embed/fw5hbjqBiSA', 'fw5hbjqBiSA'],
	['https://youtube.com/embed/fw5hbjqBiSA', 'fw5hbjqBiSA'],
	['https://youtu.be/Pb5LZxoXQW8', 'Pb5LZxoXQW8'],
	['http://www.youtube.com', null],
	['http://example.com', null],
])('for %p returns %p', (url, expectedId) => {
	expect(getYoutubeVideoId(url)).toBe(expectedId)
})
