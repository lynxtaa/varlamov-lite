import classNames from 'classnames'
import { overrideTailwindClasses } from 'tailwind-override'

export const cn = (...args: Parameters<typeof classNames>): string =>
	overrideTailwindClasses(classNames(...args))
