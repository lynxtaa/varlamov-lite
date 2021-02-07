import cn from 'classnames'
import { IconProps } from 'react-feather'

import styles from './Icon.module.css'

type Props = {
	className?: string
	icon: React.ReactElement<IconProps> | null
	size?: number
}

export default function Icon({ className, icon, size = 2 }: Props) {
	return (
		<div
			className={cn(styles.Icon, className)}
			style={{ width: `${size}rem`, height: `${size}rem` }}
		>
			{icon}
		</div>
	)
}
