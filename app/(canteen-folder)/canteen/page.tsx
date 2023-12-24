'use client'

import styles from './Canteen.module.scss'
import { useEffect, useState } from 'react'
import { useCredentials } from '@/hooks/use-auth'
import { child, get, getDatabase, ref } from 'firebase/database'
// import { usePageTitle } from '../../layouts/main/MainLayout'
import CanteenDishCard from '@/components/ui/cards/canteen-dish-card/CanteenDishCard'
import { categoriesChangeCount } from '@/utils/constants'
import {numEndings} from "@/utils/endings";
import firebase_app from '@/utils/firabaseconfig'

const categories = ['Блюда', '1', 'Классы']
const translateCategories: { [id: string]: string } = {
	Основное: 'mainDishes',
	Второе: 'secondaryDishes',
	Напитки: 'drinks'
}

type RequestType = {
	dishes: { drink?: ''; mainDish?: ''; secondDish?: '' }
	info: {}
}

function Page(): JSX.Element {
	const currentDate = new Date().toDateString()
	const [allDishes, setAllDishes] = useState<{ id?: string; count: number }[]>(
		[]
	)
	const [isLoading, setIsLoading] = useState(true)
	const [activeDish, setActiveDish] = useState<any | null>(null)
	// const setPageTitle: any = usePageTitle()
	const { school } = useCredentials()
	const database = getDatabase(firebase_app)

	useEffect(() => {
		document.title = 'Столовая'
		// setPageTitle('Столовая')

		getRequests()
	}, [])

	const getRequests = async () => {
		try {
			const classesFetched = (
				await get(child(ref(database), `schools/${school}/classes`))
			).val()

			const schoolMenu = (
				await get(child(ref(database), `schools/${school}/menu/dishes`))
			).val()

			const schoolRequests: {
				[id: string]: RequestType
			} = (
				await get(
					child(ref(database), `schools/${school}/requests/${currentDate}`)
				)
			).val()

			if (!schoolRequests) {
				setIsLoading(false)
				return
			}

			let newDishes: { [id: string]: { id?: string; count: number } } = {}
			Object.entries(schoolRequests).forEach(item => {
				// @ts-ignore
				const currentClass = item[1]['info']['class']
				Object.entries(item[1]['dishes']).forEach(dish => {
					const dishCategory = categoriesChangeCount[dish[0]]
					const dishId: string = dish[1]
					const currentDish = schoolMenu[dishCategory][dishId]

					if (Object.hasOwn(newDishes, dishId)) {
						newDishes[dishId].count++
					} else {
						newDishes = {
							...newDishes,
							[dishId]: { ...currentDish, count: 1, classes: {} }
						}
					}
					// @ts-ignore
					if (Object.hasOwn(newDishes[dishId]['classes'], currentClass)) {
						// @ts-ignore
						newDishes[dishId]['classes'][currentClass]['orders']++
					} else {
						newDishes = {
							...newDishes,
							[dishId]: {
								...newDishes[dishId],
								// @ts-ignore
								classes: {
									// @ts-ignore
									...newDishes[dishId['classes']],
									[currentClass]: {
										orders: 1,
										title: currentClass
											? classesFetched[currentClass]['title']
											: ''
									}
								}
							}
						}
					}
				})
			})

			const finalDishes = Object.values(newDishes).sort(
				(a, b) => b.count - a.count
			)

			setAllDishes(finalDishes)
			setIsLoading(false)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	return (
		<div className={styles.wrapper}>
			<section>
				<h3 style={{ marginBottom: '32px' }}>Блюда</h3>

				{!isLoading ? (
					allDishes.length ? (
						<div className={styles['dish-list']}>
							{allDishes.map(dish => {
								return (
									<CanteenDishCard
										dish={dish}
										key={dish.id}
										isActive={dish.id === activeDish?.id}
										onClick={() => {
											setActiveDish(dish ? dish : null)
										}}
									/>
								)
							})}
						</div>
					) : (
						'Заказов пока что не было.'
					)
				) : (
					'Загрузка'
				)}
			</section>
			<div className={styles.divider}></div>
			<section>
				<h3 style={{ marginBottom: '32px' }}>Классы</h3>
				{activeDish ? (
					<>
						{Object.values(activeDish.classes).map((item: any) => (
							<div key={item.title} className={styles.class}>
								<p>{item.title} класс</p>
								<div className={styles.classdivider}></div>
								<p>{item.orders} {numEndings(item.orders, ['блюдо', 'блюда', 'блюд'])}</p>
							</div>
						))}
					</>
				) : (
					<p style={{ textAlign: 'center' }}>
						Выберите блюдо в меню слева для отображения заказов этого блюда по
						классам.
					</p>
				)}

				{/*{activeDish ? (*/}
				{/*	<div style={{ marginTop: 'auto', marginBottom: '32px' }}>*/}
				{/*		<AlphaButton*/}
				{/*			type={'dark-submit'}*/}
				{/*			clickHandler={() => setActiveDish(null)}*/}
				{/*		>*/}
				{/*			Назад*/}
				{/*		</AlphaButton>*/}
				{/*	</div>*/}
				{/*) : (*/}
				{/*	''*/}
				{/*)}*/}
			</section>
		</div>
	)
}

export default Page
