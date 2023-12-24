import { ReactNode } from 'react'
import { Button, ButtonProps } from '@nextui-org/button'


function AlphaButton({
	children,
	color,
	variant,
	clickHandler,
	className,
	type
}: {
	children: ReactNode
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
	variant?: 'flat' | 'ghost' | 'bordered' | 'shadow' | 'faded' | 'light' | 'solid'
	clickHandler?: () => void,
	className?: string
	type?: 'submit' | 'reset' | 'button'
} & ButtonProps): JSX.Element {
	return (
		<Button type={type || 'button'} onClick={clickHandler} color={color || 'primary'} variant={variant || 'solid'} className={`text-medium ${className}`}>
			{children}
		</Button>
	)
}

export default AlphaButton
