import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

let mockRouter

beforeEach(() => {
	mockRouter = createMockRouter()
	useRouterMock.mockReturnValue(mockRouter)
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

it('runs search with entered query', async () => {
	server.use(
		rest.get<DefaultRequestBody, Article[]>('/api/articles', (req, res, ctx) =>
			res(ctx.json([])),
		),
	)

	renderWithProviders(<Home />)

	await screen.findByText('Ничего не найдено')

	userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
	userEvent.type(screen.getByRole('textbox', { name: 'Поиск' }), 'moscow')
	userEvent.click(screen.getByRole('button', { name: 'Отправить' }))

	await waitFor(() => {
		expect(mockRouter.push).toHaveBeenCalledWith('/search/moscow')
	})
})
