'use client'

import styles from './AllDishes.module.scss'
import { cache, useEffect, useState } from 'react'
import { useCredentials } from '@/hooks/use-auth'
import { child, get, getDatabase, ref } from 'firebase/database'
import CompactDishCard from '@/components/ui/cards/compact-dish-card/CompactDishCard'
import EditDish from '@/components/ui/edit-dish/EditDish'
import AlphaButton from '@/components/ui/buttons/AlphaButton'
import firebase_app from '@/utils/firabaseconfig'

export const revalidate = 600

const categories = ['Основное', '1', 'Второе', '2', 'Напитки']
const translateCategories: { [id: string]: string } = {
	Основное: 'mainDishes',
	Второе: 'secondaryDishes',
	Напитки: 'drinks'
}

function Page(): JSX.Element {
	const [currentFilter, setCurrentFilter] = useState('Основное')
	const [chosenDish, setChosenDish] = useState(null)
	const [allDishes, setAllDishes] = useState<{ [id: string]: any[] }>({
		mainDishes: [],
		secondaryDishes: [],
		drinks: []
	})
	const [selectOption, setSelectOption] = useState('select')
	// const setPageTitle: any = usePageTitle()
	const { school } = useCredentials()
	const database = getDatabase(firebase_app)

	useEffect(() => {
		document.title = 'Все блюда'
		// setPageTitle('Все блюда')

		// preload(school!)

		getDishes()
	}, [selectOption, chosenDish])

	const getDishes = cache(async () => {
		try {
			const schoolDishes = (
				await get(child(ref(database), `schools/${school}/menu/dishes/`))
			).val()

			setAllDishes(schoolDishes)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	})

	const changeOption = (option: string) => {
		setSelectOption(option)
	}

	const chooseToEdit = (dish: any) => {
		setChosenDish(dish)
		setSelectOption('edit')
	}

	const pageTitles: { [id: string]: string } = {
		'select': 'Добавить или редактировать',
		'add': 'Добавить блюдо',
		'edit': 'Редактировать блюдо'
	}

	return (
		<div className={styles.wrapper}>
			<section>
				<div className={styles.filters}>
					{categories.map((item, idx) => (
						<div
							key={item}
							className={`${
								idx % 2 === 0 ? styles.filter : styles['filter-divider']
							} ${currentFilter === item ? styles.active : ''}`}
							onClick={() => {
								if (!['1', '2'].find(val => val === item))
									setCurrentFilter(item)
							}}
						>
							{item}
						</div>
					))}
				</div>

				<div className={styles['dish-list']}>
					{Object.values(allDishes[translateCategories[currentFilter]]).map(
						item => (
							<CompactDishCard key={item['id']} dish={item} onClick={() => {
								chooseToEdit(item)
							}} />
						)
					)}
				</div>
			</section>
			<div className={styles.divider}></div>
			<section>
				<h3 className={'text-3xl mb-4'}>{pageTitles[selectOption]}</h3>
				<EditDish changeOptionHandler={changeOption} dish={chosenDish} changeDish={setChosenDish} type={selectOption} />
				{selectOption !== 'select' ? (
					<div style={{ marginTop: 'auto', marginBottom: '32px' }}>
						<AlphaButton
							color={'secondary'}
							variant={'solid'}
							clickHandler={() => changeOption('select')}
						>
							Назад
						</AlphaButton>
					</div>
				) : (
					''
				)}
			</section>
		</div>
	)
}

export default Page
