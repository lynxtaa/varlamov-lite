import { useCallback, useEffect, useState } from 'react'

import { isServer } from './isServer'

export const themeStorageKey = 'theme'

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

const isTheme = (value: unknown): value is Theme =>
	Object.values(Theme).some(v => v === value)

export function useTheme(): { theme: Theme; toggle: () => void } {
	const [theme, setTheme] = useState<Theme>(() => {
		if (!isServer()) {
			const storedValue = localStorage.getItem(themeStorageKey)
			if (isTheme(storedValue)) {
				return storedValue
			}
		}
		return Theme.Dark
	})

	useEffect(() => {
		if (theme === Theme.Light) {
			localStorage.setItem(themeStorageKey, Theme.Light)
			document.documentElement.classList.add(Theme.Light)
		} else {
			localStorage.setItem(themeStorageKey, Theme.Dark)
			document.documentElement.classList.remove(Theme.Light)
		}
	}, [theme])

	const toggle = useCallback(
		() => setTheme(oldTheme => (oldTheme === Theme.Dark ? Theme.Light : Theme.Dark)),
		[],
	)

	useEffect(() => {
		if (isServer()) {
			return
		}

		function updateTheme() {
			const storedValue = localStorage.getItem(themeStorageKey)
			if (isTheme(storedValue)) {
				setTheme(storedValue)
			}
		}

		window.addEventListener('storage', updateTheme)

		return function () {
			window.removeEventListener('storage', updateTheme)
		}
	}, [])

	return { theme, toggle }
}
