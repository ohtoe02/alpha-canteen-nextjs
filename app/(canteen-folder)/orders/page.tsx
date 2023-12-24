'use client'

import styles from './ActiveOrders.module.scss'
import OrderCard from "@/components/ui/cards/order-card/OrderCard";
// import {usePageTitle} from "../../layouts/main/MainLayout";
import {useEffect} from "react";


function Page(): JSX.Element {
	// const setPageTitle : any = usePageTitle()

	useEffect(() => {
		document.title = 'Активные заявки'
		// setPageTitle('Активные заявки')
	}, [])

	return (
		<div className={styles.container}>
			<div className={styles['orders-container']}>
				<OrderCard />
				<OrderCard />
			</div>
		</div>
	)
}

export default Page
