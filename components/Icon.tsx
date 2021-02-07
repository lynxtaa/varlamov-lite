import { cloneElement } from 'react'
import { IconProps } from 'react-feather'

type Props = {
	className?: string
	icon: React.ReactElement<IconProps> | null
}

export default function Icon({ className, icon }: Props) {
	return (
		<div className={className}>
			{icon === null
				? null
				: cloneElement(icon, {
						style: { width: '100%', height: '100%' },
				  })}
		</div>
	)
}
