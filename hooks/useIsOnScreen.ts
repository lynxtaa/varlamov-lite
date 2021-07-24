import { useEffect, useState } from 'react'

export function useIsOnScreen(
	element: HTMLElement | null | undefined,
	rootMargin = '0px',
): boolean {
	const [isIntersecting, setIntersecting] = useState(false)

	useEffect(() => {
		if (!element) {
			return
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setIntersecting(entry!.isIntersecting)
			},
			{ rootMargin },
		)

		observer.observe(element)

		return function () {
			observer.unobserve(element)
		}
	}, [element, rootMargin])

	return isIntersecting
}
