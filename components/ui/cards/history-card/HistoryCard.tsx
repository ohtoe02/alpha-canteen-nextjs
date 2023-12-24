import styles from './HistoryCard.module.scss'
import { OrderType } from '@/utils/types/orderType'
import { categoriesLabels } from '@/utils/constants'
import { Card, CardBody } from '@nextui-org/card'

function HistoryCard({ order }: { order: OrderType }): JSX.Element {
	const formatCategories = () => {
		const dishCategories = Object.keys(order.dishes).map(item => categoriesLabels[item])
		return dishCategories.join(' - ')
	}

	formatCategories()

	return (
		// <div className={styles.card}>
		// 	<h5 style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Заявка {order.id} - {order.info.kidName}</h5>
		// 	<div className={styles['bottom-info']}>
		// 		<p className={styles.categories}>{formatCategories()}</p>
		// 		<h2 className={styles.price}>{order.info.price}₽</h2>
		// 	</div>
		// </div>
		<Card className={'shadow-none bg-transparent'}>
			<CardBody >
				{/*<h5 style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>Заявка {order.id} - {order.info.kidName}</h5>*/}
				<h5 style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.info.kidName}</h5>
				<div className={'flex justify-between items-end'}>
					<p className={'text-xl'}>{formatCategories()}</p>
					<h2 className={`${styles.price} text-3xl font-bold`}>{order.info.price}₽</h2>
				</div>
			</CardBody>
		</Card>
	)
}

export default HistoryCard
