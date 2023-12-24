import styles from './CompactDishCard.module.scss'
import editIcon from '@/assets/Edit.png'
import Image from "next/image";

function CompactDishCard({dish, onClick}: {dish: any, onClick: () => void}): JSX.Element {
	return (
		<div className={styles['compact-card']} onClick={onClick}>
			<Image className={styles.preview} width={1000} height={1000} quality={70} src={dish['picture']} alt='' />
			<div className={styles.info}>
				<p>{dish['title']}</p>
				<p style={{color: '#808080'}}>{dish['weight']} г.</p>
			</div>
			<h3>{dish['price']}₽</h3>
			<div className={styles.edit}>
				<Image src={editIcon} width={100} height={100} alt='' />
			</div>
		</div>
	)
}

export default CompactDishCard
