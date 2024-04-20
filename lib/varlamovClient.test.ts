import { DefaultBodyType, PathParams } from 'msw'
import { z } from 'zod'

import { server, rest } from '../jest/server'

import { articleSchema, articlesSchema } from './schemas'
import { varlamovClient } from './varlamovClient'

it('loads articles', async () => {
	server.use(
		rest.get<DefaultBodyType, PathParams, z.infer<typeof articlesSchema>>(
			'https://teletype.in/api/blogs/id/500000/articles',
			async (req, res, ctx) =>
				res(
					ctx.json({
						articles: [
							{
								id: 12345,
								uri: '12345.html',
								title: 'Первая статья',
								published_at: '2020-09-01T16:30:00.000Z',
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
			published_at: '2020-09-01T16:30:00.000Z',
			cut: 'Администрация Суэцкого канала в четверг, 25 марта',
		},
	])
})

it('loads single article', async () => {
	server.use(
		rest.get('https://varlamov.me/2021/suec/03.jpg', async (req, res, ctx) => {
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

		rest.get<DefaultBodyType, PathParams, z.infer<typeof articleSchema>>(
			'https://teletype.in/api/blogs/domain/varlamov.ru/articles/:id',
			async (req, res, ctx) => {
				expect(req.params.id).toBe('12345.html')

				return res(
					ctx.json({
						id: 12345,
						uri: '12345.html',
						title: 'Первая статья',
						published_at: new Date('2020-09-01').toISOString(),
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
						`.replaceAll(/\t+/g, '  '),
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
		published_at: new Date('2020-09-01').toISOString(),
		excerpt: expect.stringContaining('Фото: FBN Raiger') as unknown,
		previewImageUrl: 'https://varlamov.me/2021/suec/03.jpg',
		readingTime: 15000,
		topics: [],
		tags: ['Китай', 'Пекин'],
		text: expect.any(String) as unknown,
	})

	expect(article.text).toMatchInlineSnapshot(`
		"<img src="https://varlamov.me/2021/suec/03.jpg" width="50" height="32"/>
		  <br/>
		  <i><span>Фото: <a href="https://www.marinetraffic.com/en/photos/of/ships/shipid:5630138">FBN Raiger / MarineTraffic.com</a></span></i>
		  <br/>
		  <br/>
		  Администрация Суэцкого канала в четверг, 25 марта, <a href="https://www.facebook.com/SuezCanalAuthorityEG/posts/415911443383226">сообщила</a>,
		  что навигация по каналу приостановлена до тех пор, пока не удастся "освободить" сверхбольшой контейнеровоз Ever Given.
		  <br/>
		  <br/>
		  Напомню, что огромное 400-метровое судно компании Evergreen, способное перевозить до 20 тысяч морских контейнеров,
		  <a href="https://varlamov.ru/4220678.html">застряло в Суэцком канале</a> утром 23 марта."
	`)
})

it('loads single article in new format', async () => {
	server.use(
		rest.get<DefaultBodyType, PathParams, z.infer<typeof articleSchema>>(
			'https://teletype.in/api/blogs/domain/varlamov.ru/articles/:id',
			async (req, res, ctx) => {
				expect(req.params.id).toBe('fESnpvxundQ')

				return res(
					ctx.json({
						id: 12345,
						uri: 'fESnpvxundQ',
						title: 'ЧМ-2018 закончился, и всё развалилось',
						published_at: new Date('2020-09-01').toISOString(),
						cut: 'ЧМ-2018 закончился, и всё развалилось',
						text: `
							<document>
								<youtube src="https://www.youtube.com/embed/fw5hbjqBiSA" size="custom" width=853 />
								<p><a href="https://www.youtube.com/ivarlamov?sub_confirmation=1" unwrapped-href="https://www.youtube.com/ivarlamov?sub_confirmation=1&ucbcb=1"><strong>Подписывайтесь на канал!</strong></a></p>
								<p>Не дождавшись буквально несколько часов до конца Чемпионата, стадион в Волгограде решил уплыть в Волгу. Так бывает, если строить с нарушением технологий, спешить, воровать, не думать.</p>
								<p>Вчера <a href="https://varlamov.ru/3002906.html">смыло</a> Нижний Новогород, сегодня смыло Волгоград, завтра будет хуже. Я объехал все города и могу поспорить, что еще много подобных картинок увидим. Хотелось бы вслед за этим увидеть уголовные дела, но, боюсь, я слишком многого хочу.</p>
								<image src="https://img3.teletype.in/files/a0/99/a0994fa1-1e21-44f7-ad0a-c14ee0ba23fd.jpeg" size="original" width=1100 height=733 naturalWidth=1100 naturalHeight=733>
								<caption>Фото: Александр Свалухин, руководитель екатеринбургского отделения <a href="https://city4people.ru">&quot;Городских проектов&quot;</a></caption>
								</image>
								<tags>
								<tag>волгоград</tag>
								<tag>чм_2018</tag>
								<tag>дождь</tag>
								<tag>потоп</tag>
								<tag>россия</tag>
								<tag>волгоградская_область</tag>
								</tags>
							</document>
						`.replaceAll(/\t+/g, '  '),
					}),
				)
			},
		),
	)

	const article = await varlamovClient.getArticle('fESnpvxundQ')

	expect(article).toEqual({
		id: 12345,
		uri: 'fESnpvxundQ',
		title: 'ЧМ-2018 закончился, и всё развалилось',
		topics: [],
		published_at: new Date('2020-09-01').toISOString(),
		excerpt: expect.stringContaining(
			'буквально несколько часов до конца Чемпионата',
		) as unknown,
		previewImageUrl:
			'https://img3.teletype.in/files/a0/99/a0994fa1-1e21-44f7-ad0a-c14ee0ba23fd.jpeg',
		readingTime: 22200,
		tags: ['волгоград', 'чм_2018', 'дождь', 'потоп', 'россия', 'волгоградская_область'],
		text: expect.any(String) as unknown,
	})

	expect(article.text).toMatchInlineSnapshot(`
		"<iframe src="https://www.youtube.com/embed/fw5hbjqBiSA" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen=""> </iframe>
		  <p><a href="https://www.youtube.com/ivarlamov?sub_confirmation=1"><strong>Подписывайтесь на канал!</strong></a></p>
		  <p>Не дождавшись буквально несколько часов до конца Чемпионата, стадион в Волгограде решил уплыть в Волгу. Так бывает, если строить с нарушением технологий, спешить, воровать, не думать.</p>
		  <p>Вчера <a href="https://varlamov.ru/3002906.html">смыло</a> Нижний Новогород, сегодня смыло Волгоград, завтра будет хуже. Я объехал все города и могу поспорить, что еще много подобных картинок увидим. Хотелось бы вслед за этим увидеть уголовные дела, но, боюсь, я слишком многого хочу.</p>
		  <figure><img src="https://img3.teletype.in/files/a0/99/a0994fa1-1e21-44f7-ad0a-c14ee0ba23fd.jpeg" width="1100" height="733"/><figcaption>Фото: Александр Свалухин, руководитель екатеринбургского отделения <a href="https://city4people.ru">&quot;Городских проектов&quot;</a></figcaption></figure>"
	`)
})
