import AlphaButton from '../buttons/AlphaButton'
import { dishType } from '@/utils/types/dishes/dishType'
import removeIcon from '@/assets/Remove.svg'
import { categoriesLabels, categoriesNames, dbCategoriesNames } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { child, get, getDatabase, push, ref, set } from 'firebase/database'
import { KidType } from '@/utils/types/kidType'
import { useCredentials } from '@/hooks/use-auth'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
// import ru from 'date-fns/locale/ru'
import DatalistInput, { useComboboxControls } from 'react-datalist-input'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { Button } from '@nextui-org/button'
import { IoTrashBinOutline } from 'react-icons/io5'
import { Chip } from '@nextui-org/chip'
import { Card, CardBody } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'

function CartItem({
										dish,
										category,
										removeHandler
									}: {
	dish: dishType
	category: string
	removeHandler: () => void
}): JSX.Element {
	'use client'

	return (
		<Card className={'h-full max-h-24'} classNames={{ body: 'p-0 flex-row' }} shadow={'sm'}>
			{dish ? (
				<CardBody className={'gap-4'}>
					<Image className={'aspect-square object-cover'} quality={70} width={100} height={100} src={dish.picture}
								 alt={dish.title} />
					<div className={'flex flex-1 py-2 lg:py-4 justify-between flex-col self-stretch'}>
						<p className={'text-large lg:text-xl leading-tight lg:leading-normal mt-1 lg:mt-0'}>{dish.title}</p>
						<p className={'text-medium lg;text-large text-gray-500'}>{dish.weight} г.</p>
					</div>
					<div className={'flex flex-col lg:flex-row justify-center mr-2 lg:mr-0'}>
						<Chip size={'lg'} variant={'bordered'} radius={'md'}
									className={'p-2 lg:p-4 border-1 border-slate-900 self-center mr-0 lg:mr-4 text-large lg:text-2xl scale-80 lg:scale-100'}>{dish.price}₽</Chip>
						<Button size={'lg'} isIconOnly color={'danger'} aria-label={'Удалить'} onClick={removeHandler}
										className={'self-center lg:mr-8 scale-75 lg:scale-100'}>
							<IoTrashBinOutline size={'32px'} />
						</Button>
					</div>
				</CardBody>
			) : (
				<h3 className={'text-medium lg:text-xl p-4 text-center'}>
					Также можно добавить {categoriesLabels[category].toLowerCase()}.
				</h3>
			)}
		</Card>
	)
}

function CartList({
										cart,
										removeDish
									}: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dishId: dishType | null) => void
}): JSX.Element {
	return (
		<div className={'flex flex-col gap-4'}>
			{categoriesNames.map(item => <CartItem
				key={item}
				dish={cart[item]}
				category={item}
				removeHandler={() => {
					removeDish(item, null)
				}}
			/>)}
		</div>
	)
}

type CheckoutInput = {
	kid: string
}

function SecondPage({
											cart,
											clearCart,
											closeHandler,
											goBack
										}: {
	cart: { [id: string]: dishType | null }
	clearCart: () => void
	closeHandler: () => void
	goBack: () => void
}) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
	const { register, handleSubmit } = useForm<CheckoutInput>()
	const { login, school } = useCredentials()
	const [kids, setKids] = useState<KidType[]>([])
	const database = getDatabase()
	const { value, setValue } = useComboboxControls({
		isExpanded: false
	})

	const price = Object.values(cart)
		.filter(item => item !== null)
		.reduce((acc, currentValue) => acc + +currentValue!.price, 0)

	const onSubmit: SubmitHandler<CheckoutInput> = async data => {
		const currentKid = kids.find(kid => kid.name === value)
		if (!currentKid) return

		let dishes = {}
		const newDate = selectedDate?.toDateString()

		Object.entries(cart)
			.filter(item => {
				return item[1] !== null
			})
			.forEach(item => (dishes = { ...dishes, [item[0]]: item[1]?.id }))

		let order: { [id: string]: string | number | {} } = {
			dishes: dishes,
			info: {
				parent: login!,
				class: currentKid.classId,
				price: price,
				kidId: currentKid.id,
				kidName: currentKid.name,
				date: newDate
			}
		}

		const key = await push(ref(database, `schools/${school}/classes/${currentKid.classId}/requests`)).key

		order = { ...order, id: key! }

		await set(ref(database, `schools/${school}/classes/${currentKid.classId}/requests/${newDate}/${key}`), order)
		// await set(ref(database, `schools/${school}/requests/${currentDate}/${key}`), order)
		await set(ref(database, `schools/${school}/users/${login}/requests/${key}`), order)

		toast.success('Заявка успешно оставлена!')
		clearCart()
	}

	useEffect(() => {
		getKids()
	}, [])

	const getKids = async () => {
		try {
			const kidsData = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/family/kids`)
				)
			).val()
			const userKids: KidType[] = Object.keys(kidsData).map(item => {
				return { id: item, ...kidsData[item] }
			})

			setKids(userKids)
		} catch (e) {
			console.log('Error on fetching', e)
		}
	}

	// registerLocale('ru', ru)

	return (
		<form>
			<div className={''}>
				<label>
					Кто питается:
					<DatalistInput
						label={''}
						placeholder={'Ребенок'}
						value={value}
						onSelect={item => {
							setValue(item.value)
						}}
						items={kids.map(item => {
							return {
								id: item.id,
								value: item.name
							}
						})}
						{...register('kid', { required: false })}
					/>
				</label>
				<label>
					Когда питается:
					<
						// @ts-ignore
						ReactDatePicker
						portalId={'root-portal'}
						popperClassName={'datepicker'}
						selected={selectedDate}
						autoComplete={'disable'}
						className={''}
						minDate={new Date()}
						locale={'ru'}
						onChange={date => {
							setSelectedDate(date)
						}}
					/>
				</label>
			</div>
			<div className={''} />
			<div className={''} style={{}}>
				<AlphaButton color={'danger'} variant={'flat'} clickHandler={goBack}>
					Назад
				</AlphaButton>
				<h3>Итого: {price}₽</h3>
				<AlphaButton clickHandler={handleSubmit(onSubmit)}>
					Готово
				</AlphaButton>
			</div>
		</form>
	)
}

function FirstPage({
										 cart,
										 removeDish,
										 clearCart,
										 closeHandler,
										 goNext
									 }: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dish: dishType | null) => void
	clearCart: () => void
	closeHandler: () => void
	goNext: () => void
}) {
	const price = Object.values(cart)
		.filter(item => item !== null)
		.reduce((acc, currentValue) => acc + +currentValue!.price, 0)

	return (
		<>
			{/*<button className={styles.close} onClick={closeHandler}>*/}
			{/*	X*/}
			{/*</button>*/}
			<CartList cart={cart} removeDish={removeDish} />
			<Divider className={'my-4'} />
			<div className={'flex justify-between items-center'}>
				<AlphaButton color={'danger'} variant={'flat'} clickHandler={clearCart}>
					Очистить
				</AlphaButton>
				<h3 className={'text-xl'}>Итого: {price}₽</h3>
				<AlphaButton color={'primary'} clickHandler={goNext}>
					Оформить
				</AlphaButton>
			</div>
		</>
	)
}

function Checkout({
										cart,
										removeDish,
										clearCart,
										closeHandler
									}: {
	cart: { [id: string]: dishType | null }
	removeDish: (category: string, dish: dishType | null) => void
	clearCart: () => void
	closeHandler: () => void
}): JSX.Element {
	const [isFirstPage, setIsFirstPage] = useState(true)

	return (
		<section className={'pb-4'}>
			{isFirstPage ? (
				<FirstPage
					cart={cart}
					removeDish={removeDish}
					clearCart={clearCart}
					closeHandler={closeHandler}
					goNext={() => setIsFirstPage(false)}
				/>
			) : (
				<SecondPage
					cart={cart}
					clearCart={clearCart}
					closeHandler={closeHandler}
					goBack={() => setIsFirstPage(true)}
				/>
			)}
		</section>
	)
}

export default Checkout
