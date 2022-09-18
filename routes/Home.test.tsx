import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { subDays, subHours, subMinutes } from 'date-fns'
import { DefaultBodyType, PathParams } from 'msw'
import { NextRouter, useRouter } from 'next/router'
import { Mock } from 'vitest'

import { Article } from '../lib/varlamovClient'
import Home from '../pages/index'
import { createMockRouter } from '../test-utils/createMockRouter'
import { renderWithProviders } from '../test-utils/renderWithProviders'
import { server, rest } from '../test-utils/server'

const useRouterMock = useRouter as Mock<[], NextRouter>

let mockRouter: NextRouter

beforeEach(() => {
	mockRouter = createMockRouter()
	useRouterMock.mockReturnValue(mockRouter)
})

it('shows blog posts', async () => {
	const now = new Date('2020-03-20')
	vi.setSystemTime(now)

	server.use(
		rest.get<DefaultBodyType, PathParams, Article[]>('/api/articles', (req, res, ctx) => {
			const articles: Article[] = [
				{
					id: 1,
					uri: '1.html',
					title: 'Первая новость',
					published_at: subMinutes(now, 2).toISOString(),
				},
				{
					id: 2,
					uri: '2.html',
					title: 'Вторая новость',
					published_at: subHours(now, 2).toISOString(),
				},
				{
					id: 3,
					uri: '3.html',
					title: 'Третья новость',
					published_at: subDays(now, 2).toISOString(),
				},
			]

			return res(ctx.json(articles))
		}),
	)

	const container = renderWithProviders(<Home />)

	expect(await screen.findByText('Первая новость')).toBeInTheDocument()

	expect(container).toMatchSnapshot()
})

it('runs search with entered query', async () => {
	server.use(
		rest.get<DefaultBodyType, PathParams, Article[]>('/api/articles', (req, res, ctx) =>
			res(ctx.json([])),
		),
	)

	renderWithProviders(<Home />)

	expect(await screen.findByText('Ничего не найдено')).toBeInTheDocument()

	await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
	await userEvent.type(screen.getByRole('textbox', { name: 'Поиск' }), 'moscow')
	await userEvent.click(screen.getByRole('button', { name: 'Отправить' }))

	await waitFor(() => {
		expect(mockRouter.push).toHaveBeenCalledWith('/search/moscow')
	})
})
