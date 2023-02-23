import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { subDays, subHours, subMinutes } from 'date-fns'
import { advanceTo } from 'jest-date-mock'
import { DefaultBodyType, PathParams } from 'msw'
import { useRouter } from 'next/navigation'

import { AppRouterInstance, createMockRouter } from '../jest/createMockRouter'
import { renderWithProviders } from '../jest/renderWithProviders'
import { rest, server } from '../jest/server'
import { Article } from '../lib/varlamovClient'

import Home from './Home'

const useRouterMock = useRouter as jest.Mock<AppRouterInstance>

let mockRouter: AppRouterInstance

beforeEach(() => {
	mockRouter = createMockRouter()
	useRouterMock.mockReturnValue(mockRouter)
})

it('shows blog posts', async () => {
	const now = new Date('2020-03-20')
	advanceTo(now)

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

	server.use(
		rest.get<DefaultBodyType, PathParams, Article[]>('/api/articles', (req, res, ctx) =>
			res(ctx.json(articles)),
		),
	)

	const { container } = renderWithProviders(<Home initialData={articles} />)

	await screen.findByText('Первая новость')

	expect(container).toMatchSnapshot()
})

it('runs search with entered query', async () => {
	const articles: Article[] = []

	server.use(
		rest.get<DefaultBodyType, PathParams, Article[]>('/api/articles', (req, res, ctx) =>
			res(ctx.json(articles)),
		),
	)

	renderWithProviders(<Home initialData={articles} />)

	await screen.findByText('Ничего не найдено')

	await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
	await userEvent.type(screen.getByRole('textbox', { name: 'Поиск' }), 'moscow')
	await userEvent.click(screen.getByRole('button', { name: 'Отправить' }))

	await waitFor(() => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(mockRouter.push).toHaveBeenCalledWith('/search/moscow')
	})
})
