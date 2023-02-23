import { render } from '@testing-library/react'
import { advanceTo } from 'jest-date-mock'
import { useRouter } from 'next/navigation'

import { createMockRouter, AppRouterInstance } from '../../../jest/createMockRouter'

import Article from './Article'

const useRouterMock = useRouter as jest.Mock<AppRouterInstance>

beforeEach(() => {
	useRouterMock.mockReturnValue(createMockRouter())
})

it('shows article', () => {
	const now = new Date(2020, 2, 20, 0, 0)
	advanceTo(now)

	const text = `
		Lorem ipsum dolor sit amet, consectetur adipisicing elit.
		Cumque voluptatum numquam, omnis saepe facere cupiditate
		sit accusamus nesciunt nam debitis voluptatem exercitationem
		fugiat modi, aliquid nostrum vitae! Repellendus atque aliquid
		corrupti animi deleniti voluptatem provident libero facilis
		veritatis aut totam, distinctio saepe reiciendis neque
		ducimus sit eligendi ut architecto iste commodi pariatur
		non soluta ea praesentium? Quas iusto placeat voluptate
		excepturi quia perspiciatis sapiente quae reprehenderit
		ratione nisi iure laudantium asperiores ad
	`.trim()

	const container = render(
		<Article
			id={1}
			uri="1.html"
			excerpt={`${text.slice(0, 100)}...`}
			previewImageUrl="https://varlamov.me/2021/izmajlovo/02.jpg"
			title="Lorem ipsum, dolor sit amet consectetur adipisicing."
			tags={['Москва', 'Россия']}
			text={`
					${text}
					<br>
					<br>
					<img src="/2021/izmajlovo/02.jpg" width="960" height="720">
					<br>
					<i>
					  <span>Фото: <a href="https://www.facebook.com/tatyana.tsarenko.94/posts/1955993087875425">Татьяна Царенко / Facebook</a></span>
					</i>
				`}
			published_at="2021-03-29T18:37:00.000Z"
			readingTime={181800}
			topics={[]}
		/>,
	)

	expect(container).toMatchSnapshot()
})
