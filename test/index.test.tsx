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
	const now = new Date(2020, 2, 20, 0, 0)
	advanceTo(now)

	const container = render(
		<Home
			initialData={[
				{ id: 1, title: 'Первая новость', createdAt: subMinutes(now, 2).toISOString() },
				{ id: 2, title: 'Вторая новость', createdAt: subHours(now, 2).toISOString() },
				{ id: 3, title: 'Третья новость', createdAt: subDays(now, 2).toISOString() },
			]}
		/>,
	)

	expect(container).toMatchSnapshot()
})
