import ReactDOMServer from 'react-dom/server'

import { server, rest } from '../jest/server'

import { Article, varlamovClient } from './varlamovClient'

const renderArticles = (articles: Article[]) =>
	ReactDOMServer.renderToStaticMarkup(
		<html>
			<head />
			<body>
				{articles.map(article => (
					<article id={`entry-varlamov.ru-${article.id}`} key={article.id}>
						<div className="j-e-title">
							<a href={`https://varlamov.ru/${article.id}.html`}>{article.title}</a>
						</div>
						<time itemProp="dateCreated">{article.createdAt}</time>
					</article>
				))}
			</body>
		</html>,
	)

const renderArticle = (article: {
	id: number
	title: string
	createdAt: string | null
	html: string
	tags: string[]
}) =>
	ReactDOMServer.renderToStaticMarkup(
		<html>
			<head />
			<body>
				<div className="j-e-title">
					<a href={`https://varlamov.ru/${article.id}.html`}>{article.title}</a>
				</div>
				<time itemProp="dateCreated">{article.createdAt}</time>
				<div id="entrytext" dangerouslySetInnerHTML={{ __html: article.html }}></div>
				<ul>
					{article.tags.map(tag => (
						<li key={tag} className="j-e-tags-item">
							{tag}
						</li>
					))}
				</ul>
			</body>
		</html>,
	)

it('loads articles', async () => {
	server.use(
		rest.get('https://varlamov.ru', (req, res, ctx) =>
			res(
				ctx.text(
					renderArticles([
						{ id: 12345, title: 'Первая статья', createdAt: '1 сентября 2020, 19:30' },
					]),
				),
			),
		),
	)

	const articles = await varlamovClient.getArticles({ pageNum: 1 })

	expect(articles).toEqual([
		{ id: 12345, createdAt: '2020-09-01T16:30:00.000Z', title: 'Первая статья' },
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

		rest.get('https://varlamov.ru/:id.html', (req, res, ctx) => {
			expect(req.params.id).toBe('12345')

			return res(
				ctx.text(
					renderArticle({
						id: 12345,
						title: 'Первая статья',
						createdAt: '1 сентября 2020',
						tags: ['Китай', 'Пекин'],
						html: `
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
						`.replace(/\t+/g, '  '),
					}),
				),
			)
		}),
	)

	const article = await varlamovClient.getArticle(12345)

	expect(article).toEqual({
		id: 12345,
		createdAt: '2020-08-31T21:00:00.000Z',
		title: 'Первая статья',
		excerpt: expect.stringContaining('Фото: FBN Raiger'),
		previewImageUrl: 'https://varlamov.me/2021/suec/03.jpg',
		readingTime: 18600,
		tags: ['Китай', 'Пекин'],
		text: expect.any(String),
	})

	expect(article.text).toMatchInlineSnapshot(`
		"
		  <img src=\\"https://varlamov.me/2021/suec/03.jpg\\" width=\\"50\\" height=\\"32\\">
		  <br>
		  <i><span>Фото: <a href=\\"https://www.marinetraffic.com/en/photos/of/ships/shipid:5630138\\">FBN Raiger / MarineTraffic.com</a></span></i>
		  <br>
		  <br>
		  Администрация Суэцкого канала в четверг, 25 марта, <a href=\\"https://www.facebook.com/SuezCanalAuthorityEG/posts/415911443383226\\">сообщила</a>,
		  что навигация по каналу приостановлена до тех пор, пока не удастся \\"освободить\\" сверхбольшой контейнеровоз Ever Given.
		  <br>
		  <br>
		  Напомню, что огромное 400-метровое судно компании Evergreen, способное перевозить до 20 тысяч морских контейнеров,
		  <a href=\\"https://varlamov.ru/4220678.html\\">застряло в Суэцком канале</a> утром 23 марта.
		  "
	`)
})
