'use client'

import styles from './MyFamily.module.scss'
import KidList from '@/components/ui/cards/kid-list/KidList'
// import { usePageTitle } from '../../layouts/main/MainLayout'
import { useEffect, useState } from 'react'
import { child, get, getDatabase, ref } from 'firebase/database'
import { useCredentials } from '@/hooks/use-auth'
import { KidType } from '@/utils/types/kidType'
import HistoryList from '@/components/ui/cards/history-list/HistoryList'
import { OrderType } from '@/utils/types/orderType'
import AlphaButton from '@/components/ui/buttons/AlphaButton'
import firebase_app from '@/utils/firabaseconfig'
import { useRouter } from 'next/navigation'

function Page(): JSX.Element {
	const [kids, setKids] = useState<KidType[]>([])
	const [orders, setOrders] = useState<OrderType[]>([])
	// const setPageTitle: any = usePageTitle()
	const database = getDatabase(firebase_app)
	const router = useRouter()
	const { login, school } = useCredentials()

	const getCurrentOrders = async () => {
		try {
			const userOrdersRef = child(ref(database), `schools/${school}/users/${login}/requests`);
			const userOrdersSnapshot = await get(userOrdersRef);
			const userOrders = userOrdersSnapshot.val();

			const currentDate = new Date(new Date().toDateString()).getTime();

			const history: OrderType[] | unknown[] = Object.values(userOrders)
				.reverse()
			// @ts-ignore
				.filter((item) => new Date(item['info']['date']).getTime() >= currentDate);

			// @ts-ignore
			setOrders(history);
		} catch (e) {
			console.log('Error on fetching', e);
		}
	};

	const getKids = async () => {
		try {
			const kidsRef = child(ref(database), `schools/${school}/users/${login}/family/kids`)
			const snapshot = await get(kidsRef)
			const userKids = snapshot.val()
			const emptyOne: KidType[] = Object.keys(userKids).map(item => ({ id: item, ...userKids[item] }))

			setKids(emptyOne)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	useEffect(() => {
		document.title = 'Мой профиль'
		// setPageTitle('Мой профиль')

		getKids()
		getCurrentOrders()
	}, [])

	return (
		<div className={styles.wrapper}>
			<KidList kids={kids} />
			<div className={styles.divider}></div>
			<section className={styles.left}>
				<h3 className={'text-4xl text-center overflow-ellipsis w-full'}>Активные заявки</h3>
				<HistoryList orders={orders} />
				<AlphaButton
					color={'secondary'}
					variant={'shadow'}
					clickHandler={() => router.push('/history')}
				>
					Перейти в историю заявок
				</AlphaButton>
			</section>
		</div>
	)
}

export default Page
