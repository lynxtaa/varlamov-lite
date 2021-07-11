import { screen } from '@testing-library/react'
import { subDays, subHours, subMinutes } from 'date-fns'
import { advanceTo } from 'jest-date-mock'
import { DefaultRequestBody } from 'msw'
import { NextRouter, useRouter } from 'next/router'

import { createMockRouter } from '../jest/createMockRouter'
import { renderWithProviders } from '../jest/renderWithProviders'
import { server, rest } from '../jest/server'
import { Article } from '../lib/varlamovClient'
import Home from '../pages/index'

const useRouterMock = useRouter as jest.Mock<NextRouter>

beforeEach(() => {
	useRouterMock.mockReturnValue(createMockRouter())
})

it('shows blog posts', async () => {
	const now = new Date('2020-03-20')
	advanceTo(now)

	server.use(
		rest.get<DefaultRequestBody, Article[]>('/api/articles', (req, res, ctx) => {
			const articles: Article[] = [
				{
					id: 1,
					uri: '1.html',
					title: 'Первая новость',
					created_at: subMinutes(now, 2).toISOString(),
				},
				{
					id: 2,
					uri: '2.html',
					title: 'Вторая новость',
					created_at: subHours(now, 2).toISOString(),
				},
				{
					id: 3,
					uri: '3.html',
					title: 'Третья новость',
					created_at: subDays(now, 2).toISOString(),
				},
			]

			return res(ctx.json(articles))
		}),
	)

	const container = renderWithProviders(<Home />)

	await screen.findByText('Первая новость')

	expect(container).toMatchSnapshot()
})
