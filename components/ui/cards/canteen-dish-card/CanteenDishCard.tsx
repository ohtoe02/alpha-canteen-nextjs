import styles from './CanteenDishCard.module.scss'
import { numEndings } from '@/utils/endings'

function CanteenDishCard({
	dish,
	isActive,
	onClick
}: {
	dish: any
	isActive: boolean
	onClick?: () => void
}): JSX.Element {
	return (
		<div
			className={`${styles['canteen-card']} ${isActive ? styles.active : ''}`}
			onClick={onClick}
		>
			<img
				className={styles.preview}
				src={
					dish['picture']
						? dish['picture']
						: 'https://assets.materialup.com/uploads/b03b23aa-aa69-4657-aa5e-fa5fef2c76e8/preview.png'
				}
				alt=''
			/>
			<p style={{ flex: '1', textOverflow: 'ellipsis' }}>
				{dish ? dish['title'] : ''}
			</p>
			<div className={styles.divider}></div>
			<p>
				{dish.count} {numEndings(dish.count, ['заказ', 'заказа', 'заказов'])}
			</p>
		</div>
	)
}

export default CanteenDishCard
