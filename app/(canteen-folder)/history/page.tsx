'use client'

import styles from './History.module.scss'
import HistoryList from '@/components/ui/cards/history-list/HistoryList'
import { useEffect, useState } from 'react'
// import { usePageTitle } from '../../layouts/main/MainLayout'
import { child, get, getDatabase, ref } from 'firebase/database'
import { useCredentials } from '@/hooks/use-auth'
import AlphaButton from '@/components/ui/buttons/AlphaButton'
import firebase_app from '@/utils/firabaseconfig'
import { useRouter } from 'next/navigation'
import { Cardo } from 'next/dist/compiled/@next/font/dist/google'
import { Card } from '@nextui-org/card'
import { Button } from '@nextui-org/button'

function Page(): JSX.Element {
	const [orderHistory, setOrderHistory] = useState([])
	// const setPageTitle: any = usePageTitle()
	const database = getDatabase(firebase_app)
	const { login, school } = useCredentials()
	const router = useRouter()

	const getHistory = async () => {
		try {
			const dbOrderHistory = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/requests`)
				)
			).val()

			// @ts-ignore
			setOrderHistory(Object.values(dbOrderHistory).reverse())
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	useEffect(() => {
		document.title = 'История заказов'
		// setPageTitle('История заказов')

		getHistory()
	}, [])

	return (
		<div className={styles.container}>
			<h1 className={"text-5xl text-center overflow-ellipsis w-full"}>История заказов</h1>
			<HistoryList orders={orderHistory} />
			<Button
				size={'lg'}
				onClick={() => {
					router.push('/family')
				}}
				className={'flex-shrink-0'}
				color={'secondary'}
				variant={'shadow'}
			>
				Перейти к активным заявкам
			</Button>
		</div>
	)
}

export default Page
