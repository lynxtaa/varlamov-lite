import { render } from '@testing-library/react'
import { subDays, subHours, subMinutes } from 'date-fns'
import { advanceTo } from 'jest-date-mock'
import { NextRouter, useRouter } from 'next/router'

import { createMockRouter } from '../jest/createMockRouter'
import Home from '../pages/index'

const useRouterMock = useRouter as jest.Mock<NextRouter>

beforeEach(() => {
	useRouterMock.mockReturnValue(createMockRouter())
})

it('shows blog posts', () => {
	const now = new Date('2020-03-20')
	advanceTo(now)

	const container = render(
		<Home
			initialData={[
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
			]}
		/>,
	)

	expect(container).toMatchSnapshot()
})
