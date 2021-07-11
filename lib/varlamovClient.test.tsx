import { DefaultRequestBody } from 'msw'
import { Infer } from 'myzod'

import { server, rest } from '../jest/server'

import { articleSchema, articlesSchema } from './schemas'
import { varlamovClient } from './varlamovClient'

it('loads articles', async () => {
	server.use(
		rest.get<DefaultRequestBody, Infer<typeof articlesSchema>>(
			'https://teletype.in/api/blogs/id/500000/articles',
			(req, res, ctx) =>
				res(
					ctx.json({
						articles: [
							{
								id: 12345,
								uri: '12345.html',
								title: 'Первая статья',
								created_at: '2020-09-01T16:30:00.000Z',
								cut: 'Администрация Суэцкого канала в четверг, 25 марта',
							},
						],
					}),
				),
		),
	)

	const articles = await varlamovClient.getArticles()

	expect(articles).toEqual([
		{
			id: 12345,
			uri: '12345.html',
			title: 'Первая статья',
			created_at: '2020-09-01T16:30:00.000Z',
			cut: 'Администрация Суэцкого канала в четверг, 25 марта',
		},
	])
})

it('loads single article', async () => {
	server.use(
		rest.get('https://varlamov.me/2021/suec/03.jpg', (req, res, ctx) => {
			ctx.set('Content-Type', 'image/png')

			return res(
				ctx.body(
					Buffer.from(
						// Картинка png размером 50x32
						`iVBORw0KGgoAAAANSUhEUgAAADIAAAAgAQAAAAB4WhaMAAAAC0lEQVR42mMY4QAAAQAAAcAn/9sAAAAASUVORK5CYII=`,
						'base64',
					),
				),
			)
		}),

		rest.get<DefaultRequestBody, Infer<typeof articleSchema>>(
			'https://teletype.in/api/blogs/domain/varlamov.ru/articles/:id',
			(req, res, ctx) => {
				expect(req.params.id).toBe('12345.html')

				return res(
					ctx.json({
						id: 12345,
						uri: '12345.html',
						title: 'Первая статья',
						created_at: new Date('2020-09-01').toISOString(),
						cut: 'Администрация Суэцкого канала...',
						text: `
							<document>
								<img src="https://varlamov.me/2021/suec/03.jpg" loading="lazy" />
								<br />
								<i><span style="font-size: 0.8em">Фото: <a href="https://www.marinetraffic.com/en/photos/of/ships/shipid:5630138" target="_blank">FBN Raiger / MarineTraffic.com</a></span></i>
								<br />
								<br />
								Администрация Суэцкого канала в четверг, 25 марта, <a href="https://www.facebook.com/SuezCanalAuthorityEG/posts/415911443383226" target="_blank">сообщила</a>,
								что навигация по каналу приостановлена до тех пор, пока не удастся "освободить" сверхбольшой контейнеровоз Ever Given.
								<br />
								<br />
								Напомню, что огромное 400-метровое судно компании Evergreen, способное перевозить до 20 тысяч морских контейнеров,
								<a href="https://varlamov.ru/4220678.html" target="_blank">застряло в Суэцком канале</a> утром 23 марта.
								<tags><tag>Китай</tag><tag>Пекин</tag></tags>
							<document>
						`.replace(/\t+/g, '  '),
					}),
				)
			},
		),
	)

	const article = await varlamovClient.getArticle('12345.html')

	expect(article).toEqual({
		id: 12345,
		uri: '12345.html',
		title: 'Первая статья',
		created_at: new Date('2020-09-01').toISOString(),
		excerpt: expect.stringContaining('Фото: FBN Raiger'),
		previewImageUrl: 'https://varlamov.me/2021/suec/03.jpg',
		readingTime: 18600,
		tags: ['Китай', 'Пекин'],
		text: expect.any(String),
	})

	expect(article.text).toMatchInlineSnapshot(`
"<img src=\\"https://varlamov.me/2021/suec/03.jpg\\" width=\\"50\\" height=\\"32\\">
  <br>
  <i><span>Фото: <a href=\\"https://www.marinetraffic.com/en/photos/of/ships/shipid:5630138\\">FBN Raiger / MarineTraffic.com</a></span></i>
  <br>
  <br>
  Администрация Суэцкого канала в четверг, 25 марта, <a href=\\"https://www.facebook.com/SuezCanalAuthorityEG/posts/415911443383226\\">сообщила</a>,
  что навигация по каналу приостановлена до тех пор, пока не удастся \\"освободить\\" сверхбольшой контейнеровоз Ever Given.
  <br>
  <br>
  Напомню, что огромное 400-метровое судно компании Evergreen, способное перевозить до 20 тысяч морских контейнеров,
  <a href=\\"https://varlamov.ru/4220678.html\\">застряло в Суэцком канале</a> утром 23 марта."
`)
})
