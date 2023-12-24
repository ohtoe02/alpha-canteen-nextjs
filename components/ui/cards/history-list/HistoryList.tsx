import styles from './HistoryList.module.scss'
import HistoryCard from '../history-card/HistoryCard'
import { OrderType } from '@/utils/types/orderType'
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox'
import { ScrollShadow } from '@nextui-org/scroll-shadow'

function HistoryList({ orders }: { orders: OrderType[] }): JSX.Element {
	return (
		// <div className={styles['history-list']}>
		// 	{orders.map(order => <HistoryCard order={order} key={order.id} />)}
		// </div>

		<Listbox className={' overflow-scroll scrollbar-hide border-1 border-slate-900 rounded-medium p-4 mb-4'}
						 variant='faded'>
				{orders.map(order => <ListboxItem showDivider key={order.id}><HistoryCard order={order} /></ListboxItem>)}
		</Listbox>
	)
}

export default HistoryList
