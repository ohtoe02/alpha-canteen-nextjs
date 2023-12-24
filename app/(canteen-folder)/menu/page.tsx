'use client'

import styles from './Menu.module.scss'
import DishList from '@/components/ui/cards/dish-list/DishList'
import { useEffect, useState } from 'react'
import { categoriesLabels } from '@/utils/constants'
import Checkout from '@/components/ui/checkout/Checkout'
import { dishType } from '@/utils/types/dishes/dishType'
import { useDispatch, useStore } from 'react-redux'
import { setDish, clearCart } from '@/utils/store/slices/cartSlice'
import { getDishes } from '@/utils/get-items/getItems'
import { Tab, Tabs } from '@nextui-org/tabs'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Skeleton } from '@nextui-org/skeleton'
import { CartIcon } from '@nextui-org/shared-icons'
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import Loading from '@/app/loading'

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		padding: 0,
		borderRadius: '16px',
		boxShadow: '0 0 8px rgba(40, 40, 40, 0.4)',
		backgroundColor: 'white',
		border: 'none',
		transform: 'translate(-50%, -50%)'
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		zIndex: 1000
	}
}

const dishTables = [
	{
		title: 'Основные блюда',
		dbId: 'mainDishes',
		category: 'mainDish'
	},
	{
		title: 'Вторые блюда',
		dbId: 'secondaryDishes',
		category: 'secondDish'
	},
	{
		title: 'Напитки',
		dbId: 'drinks',
		category: 'drink'
	}]

// @ts-ignore
function Page(): JSX.Element {
	const [schoolDishesCur, setSchoolDishesCur] = useState<{ [id: string]: dishType[] }>({
		drinks: [],
		mainDishes: [],
		secondaryDishes: []
	})
	const [cart, setCart] = useState<{
		[id: string]: dishType | null;
	}>({
		mainDish: null,
		secondDish: null,
		drink: null
	})
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [isLoaded, setIsLoaded] = useState(false)
	const dispatch = useDispatch()
	const store = useStore()

	useEffect(() => {
		document.title = 'Меню'

		const fetchDishes = async () => {
			try {
				setSchoolDishesCur(await getDishes())
				setTimeout(() => setIsLoaded(true), 350)
			} catch (e) {
				console.log('Error on fetching', e)
			}
		}

		fetchDishes()
	}, [])

	useEffect(() => {
		// @ts-ignore
		const { cart } = store.getState()
		setCart(cart)
	}, [schoolDishesCur])

	const updateCart = (category: string, dish: dishType | null) => {
		setCart({ ...cart, [category]: dish })
		dispatch(setDish({ type: category, dish: dish }))
	}

	const clearCartHandler = () => {
		setCart({
			mainDish: null,
			secondDish: null,
			drink: null
		})
		dispatch(clearCart())
	}

	return (
		<>
			<div className={`flex justify-center gap-8`}>
				<
					// @ts-ignore
					Modal
					isOpen={isOpen}
					placement={'bottom'}
					onOpenChange={onOpenChange}
					backdrop={'opaque'}
					size={'3xl'}

				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader>
									<h1>Моя корзина</h1>
								</ModalHeader>
								<ModalBody>

									<Checkout
										cart={cart}
										closeHandler={onClose}
										removeDish={updateCart}
										clearCart={clearCartHandler}
									/>
								</ModalBody>
							</>
						)
						}
					</ModalContent>
				</Modal>
				{!isLoaded && <Loading />}
				<Card className={`max-w-fit lg:w-3/4 ${!isLoaded && 'invisible'}`}>
					<CardBody className={'items-center p-4 overflow-x-hidden'}>
						<Tabs radius={'md'} variant={'bordered'} className={'justify-center scale-75 sm:scale-100'} size={'lg'}
									classNames={{ tabContent: 'text-black' }}
									color={'secondary'}>
							{dishTables.map((item) =>
								<Tab key={item.category} title={item.title} className={'w-full'}>
									<Skeleton className={'rounded-xl w-full '} isLoaded={isLoaded}>
										<DishList
											dishes={Object.values(schoolDishesCur[item.dbId])}
											cart={cart}
											category={item.category}
											chooseHandler={dish => {
												updateCart(item.category, dish)
											}}
										/>
									</Skeleton>
								</Tab>
							)}
						</Tabs>
					</CardBody>
				</Card>

				<Card className={'h-full hidden lg:block ${!isLoaded && \'invisible\'}'}>
					<CardHeader className={'pb-0'}>
						<h1 className={'text-2xl text-center mx-auto m-0'}>Моя корзина</h1>
					</CardHeader>
					<CardBody >
						<Checkout
							cart={cart}
							closeHandler={() => {
							}}
							removeDish={updateCart}
							clearCart={clearCartHandler}
						/>
					</CardBody>
				</Card>


			</div>
			{
				Object.values(cart).filter(item => item).length ? (
					<Button color={'secondary'} isIconOnly size={'lg'}
									className={`transition-all fixed bottom-8 right-8 flex gap-4 scale-[135%] items-center lg:hidden`}
									onClick={onOpen}>
						{/*{Object.entries(cart)*/}
						{/*	.filter(item => item[1])*/}
						{/*	.map(item => categoriesLabels[item[0]])*/}
						{/*	.join(' - ')}*/}
						<CartIcon size={32} />
					</Button>
				) : null
			}
		</>
	)
}

export default Page
