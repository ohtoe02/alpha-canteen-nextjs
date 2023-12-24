import styles from './DishCard.module.scss'
import { dishType } from '@/utils/types/dishes/dishType'
import {useState} from 'react'
import Image from 'next/image'
import { Chip } from '@nextui-org/chip'

function DishCard({
	id,
	dish,
	isSelected,
	selectHandler
}: {
	id: string
	dish: dishType
	isSelected: boolean
	selectHandler: (event: any) => void
}): JSX.Element {
	const [isVisible, setIsVisible] = useState(false)

	return (
		<div
			className={`${styles['dish-card']}  ${isSelected ? styles.selected : ''} text-medium lg:text-large xl:text-xl`}
			onMouseEnter={() => {
				setIsVisible(true)
			}}
			onMouseLeave={() => {
				setIsVisible(false)
			}}
		>
			<div className={styles['image-wrapper']}>
				<Image
					className={`${styles.image} aspect-auto`}
					draggable={false}
					width={256}
					height={256}
					src={dish!.picture}
					alt={dish!.title}
					quality={70}
					loading={'lazy'}
				/>
				{isSelected && <div className={`${styles.carted} text-2xl lg:text-3xl xl:text-4xl`}>В корзине</div>}
				<div
					className={`${styles.add} ${isVisible ? styles.visible : ''}`}
					onClick={selectHandler}
				>
					{isSelected ? '-' : '+'}
				</div>
				{/*<div className={styles['price-tag']}>{dish!.price} ₽</div>*/}
				<Chip variant={'bordered'} radius={'md'} size={'lg'} classNames={{'content': 'font-bold'}} className={'absolute border-1 bottom-2 right-2 backdrop-blur bg-slate-900 bg-opacity-50 text-white'}>{dish!.price} ₽</Chip>
			</div>
			<h4 className={styles.weight}>{dish!.weight} г.</h4>
			<h4>{dish!.title}</h4>
		</div>
	)
}

export default DishCard
