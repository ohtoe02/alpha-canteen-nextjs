'use client'

import styles from './EditDish.module.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import cameraIcon from '@/assets/Camera.png'
import AlphaButton from '../buttons/AlphaButton'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { getDatabase, ref, push, set, update, remove } from 'firebase/database'
import {
	getStorage,
	ref as storageRef,
	uploadBytes,
	getDownloadURL
} from 'firebase/storage'
import { useCredentials } from '@/hooks/use-auth'
import { toast } from 'react-toastify'
import DatalistInput, { useComboboxControls } from 'react-datalist-input'
import { dbCategoriesNames } from '@/utils/constants'
import Image from 'next/image'
import firebase_app from '@/utils/firabaseconfig'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'

const SelectAction = ({
												changeOptionHandler
											}: {
	changeOptionHandler: (option: string) => void
}) => {
	return (
		<>
			<p>Вы можете</p>
			<div className={styles.submit}>
				<AlphaButton
					clickHandler={() => changeOptionHandler('add')}
				>
					Добавить блюдо
				</AlphaButton>
			</div>
			<p style={{ textAlign: 'center', width: '75%' }}>
				или редактировать блюдо, выбрав его в меню слева
			</p>
		</>
	)
}

type Inputs = {
	title: string
	category: string
	weight: string
	price: string
	image: FileList
}

const AddDish = ({
									 changeOptionHandler,
									 type,
									 dish,
									 changeDish
								 }: {
	changeOptionHandler: (option: string) => void
	type: string
	dish?: any
	changeDish: Dispatch<SetStateAction<null>>
}) => {
	const {
		register,
		handleSubmit,
		watch
	} = useForm<Inputs>()
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [selectedCategory, setSelectedCategory] = useState('')
	// const { value, setValue } = useComboboxControls({
	// 	isExpanded: false,
	// 	initialValue: dish ? dbCategoriesNames[dish['category']] : ''
	// })
	const [value, setValue] = useState<string>('')
	const [title, setTitle] = useState<string>('')
	const [price, setPrice] = useState<string>('')
	const [weight, setWeight] = useState<string>('')
	const [image, setImage] = useState<string>('')
	const { school } = useCredentials()
	const database = getDatabase(firebase_app)
	const storage = getStorage(firebase_app)

	useEffect(() => {
		if (type === 'edit') {
			setTitle(dish['title'])
			setPrice(dish['price'])
			setValue(dish['category'])
			setSelectedCategory(dish['category'])
			setWeight(dish['weight'])
			setSelectedImage(dish['picture'])
		}
	}, [dish])

	useEffect(() => {
		return () => {
			const image = watch('image')[0]
			if (!image) return
			const imageUrl = URL.createObjectURL(image)
			setSelectedImage(imageUrl)
		}
	}, [watch('image')])

	const addDish: SubmitHandler<Inputs> = async data => {
		try {
			const image = data.image[0]
			const key = push(
				ref(database, `schools/${school}/menu/dishes/${selectedCategory}`)
			).key
			const imageRef = storageRef(storage, `Images/${school}/${key}`)

			const uploadedImage = await uploadBytes(imageRef, image)
			const imageURL = await getDownloadURL(uploadedImage.ref)
			await set(
				ref(
					database,
					`schools/${school}/menu/dishes/${selectedCategory}/${key}`
				),
				{
					...data,
					category: selectedCategory,
					picture: imageURL,
					id: key
				}
			)

			toast.success(`Блюдо ${data.title} успешно добавлено!`, {
				position: 'bottom-right'
			})
			changeOptionHandler('select')
		} catch (e) {
			console.log(e)
		}
	}

	const editDish = async (data: FormData) => {
		const currentDishRef = ref(
			database,
			`schools/${school}/menu/dishes/${selectedCategory}/${dish['id']}`
		)

		console.log(currentDishRef)

		console.log(data.get('title'))

		await update(currentDishRef, {
			category: selectedCategory,
			price: data.get('price'),
			title: data.get('title'),
			weight: data.get('weight')
		})
			.then(() => {
				toast.success('Блюдо обновлено!')
				changeDish({
					...dish,
					price: data.get('price'),
					title: data.get('title'),
					weight: data.get('weight')
				})
				console.log('updated!')
			})
			.catch(e => console.log(e))
	}

	const removeDish = () => {
		remove(
			ref(
				database,
				`schools/${school}/menu/dishes/${dish['category']}/${dish['id']}`
			)
		).then(r => {
			toast.success('Блюдо удалено!')
			changeOptionHandler('select')
		})
	}

	return (
		<form action={(data) => {
			type === 'add'
				? editDish(data)
				: editDish(data)
		}}>
			<div className={styles['add-edit-form']}>
				<div className={styles['dish-image']}>
					<p>Добавить фото</p>
					<Image src={cameraIcon} width={1000} height={1000} alt={''} />
					<input
						type='file'
						accept={'image/*'}
						alt={''}
						{...register('image', { required: true })}
					/>
					<Image
						style={{
							visibility: selectedImage ? 'visible' : 'hidden',
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: 0,
							objectFit: 'cover',
							backgroundPosition: 'center'
						}}
						width={1000}
						height={1000}
						quality={80}
						src={selectedImage ? selectedImage : ''}
						alt={''}
					/>
				</div>
				<div className={styles.inputs}>
					<Input
						type='text'
						label={'Название'}
						placeholder={'Название'}
						autoComplete={'off'}
						name={'title'}
						value={title}
						maxLength={30}
						minLength={3}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Select
						label={'Категория'}
						placeholder={'Выберите категорию'}
						selectedKeys={value !== '' ? [value] : []}
						onChange={(e) => {
							setValue(e.target.value)
						}}
					>
						<SelectItem key={'mainDishes'} value={'Основное'}>Основное</SelectItem>
						<SelectItem key={'secondaryDishes'} value={'Второе'}>Второе</SelectItem>
						<SelectItem key={'drinks'} value={'Напитки'}>Напитки</SelectItem>
					</Select>
					<div className={styles.inline}>
						<Input
							type='number'
							label={'Вес'}
							placeholder={'Вес'}
							autoComplete={'off'}
							name={'weight'}
							value={weight}
							maxLength={4}
							minLength={1}
							onChange={(e) => setWeight(e.target.value)}
						/>
						<Input
							type='number'
							label={'Цена'}
							placeholder={'Цена'}
							autoComplete={'off'}
							name={'price'}
							value={price}
							maxLength={4}
							minLength={1}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<div className={styles.submit}>
				<AlphaButton className={'mb-4'} type={'submit'}>
					{type === 'add' ? 'Добавить блюдо' : 'Изменить блюдо'}
				</AlphaButton>
				{type === 'edit' ? (
					<AlphaButton color={'danger'} variant={'light'} clickHandler={removeDish}>
						Удалить блюдо
					</AlphaButton>
				) : (
					''
				)}
			</div>
		</form>
	)
}

function EditDish({
										type,
										dish,
										changeOptionHandler,
										changeDish
									}: {
	type: string
	dish: any
	changeOptionHandler: (option: string) => void
	changeDish: Dispatch<SetStateAction<null>>
}): JSX.Element {
	const elements: {
		[id: string]: JSX.Element
	} = {
		select: <SelectAction changeOptionHandler={changeOptionHandler} />,
		add: <AddDish type={'add'} changeOptionHandler={changeOptionHandler} changeDish={changeDish} />,
		edit: (
			<AddDish
				dish={dish}
				type={'edit'}
				changeOptionHandler={changeOptionHandler}
				changeDish={changeDish}
			/>
		)
	}

	return <>{elements[type]}</>
}

export default EditDish
