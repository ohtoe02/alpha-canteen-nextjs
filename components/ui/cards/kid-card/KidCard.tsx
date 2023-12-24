import styles from './KidCard.module.scss'
import { KidType } from '@/utils/types/kidType'
import kidImage from '@/assets/2.png'
import editIcon from '@/assets/Edit.png'
import Image from 'next/image'

function KidCard({ kidData }: { kidData: KidType }): JSX.Element {
	let image = kidData.image

	if (image === '' || image === undefined) {
		image = kidImage.src
	}

	return (
		<div className={styles.card}>
			<div className={styles.left}>
				<Image src={image} fill quality={80} loading={'lazy'} alt={'kid'} />
				<div className={styles['kid-info']}>
					<p>{kidData.name}</p> <p>11Б Класс</p>
				</div>
			</div>
			{/*<div className={styles.edit}><Image src={editIcon} objectFit={'contain'} width={48} height={48} className={""} alt="edit"/></div>*/}
		</div>
	)
}

export default KidCard
