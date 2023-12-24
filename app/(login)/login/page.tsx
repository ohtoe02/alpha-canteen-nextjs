'use client'

import styles from './LoginLayout.module.scss'
import { useForm } from 'react-hook-form'
import AlphaButton from '@/components/ui/buttons/AlphaButton'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { child, get, getDatabase, ref } from 'firebase/database'
import { setUser } from '@/utils/store/slices/userSlice'
import { useAuth } from '@/hooks/use-auth'
import firebase_app from '@/utils/firabaseconfig'
import { useRouter } from 'next/navigation'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { NavigateTo } from '@/utils/navigation/navigation'

type Inputs = {
	login: string
	password: string
	school: string
}

function Page(): JSX.Element {
	const [schools, setSchools] = useState<{ [id: string]: string }[]>([])
	const [school, setSchool] = useState('')
	const [reversedSchools, setReversedSchools] = useState<
		{ [id: string]: string }[]
	>([])
	const router = useRouter()
	const { isAuth } = useAuth()

	useEffect(() => {
		document.title = 'Вход в систему'
		getSchools()
	}, [])
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<Inputs>()

	const dispatch = useDispatch()

	const database = getDatabase(firebase_app)


	const getSchools = async () => {
		try {
			const dbSchools = (await get(child(ref(database), `allSchools`))).val()
			const schoolList = Object.keys(dbSchools).map(item => {
				return { [item]: dbSchools[item] }
			})
			const reversedList = Object.keys(dbSchools).map(item => {
				return { [dbSchools[item]]: item }
			})

			setSchools(schoolList)
			setReversedSchools(reversedList)
		} catch (e) {
		}
	}

	const onSubmit = async (data: FormData) => {
		const pass = data.get('password')
		const login = data.get('login')

		const getUser = async () => {
			try {
				const userRef = child(ref(database), `schools/${school}/users/${login}/`)
				const userSnapshot = await get(userRef)
				const user = userSnapshot.val()

				if (user.password === pass) {
					dispatch(setUser({ login, school: user.school }))
					router.replace('/menu')
				} else {
					alert('Неверный пароль')
				}
			} catch (e) {
				console.log('Error on fetching')
			}
		}

		await getUser()
	}

	return (
		<section className={`${styles['login-container']}`}>
			{isAuth && <NavigateTo type={'replace'} path={'/menu'} />}
			<h1 className={'font-bold mb-12 text-4xl text-white'}>Вход в систему</h1>
			<form className={`${styles['login-form']}`} action={onSubmit}>
				<Input
					{...register('login', { required: true })}
					label={'Логин'}
					type={'text'}
					name={'login'}
					size={'sm'}
					placeholder={'Введите ваш логин'}

					classNames={{input: 'text-black'}}
				/>
				<Input
					{...register('password', { required: true, minLength: 3 })}
					label={'Пароль'}
					type={'password'}
					name={'password'}
					size={'sm'}
					placeholder={'Введите ваш пароль'}
				/>
				<Select
					label={'Школа'}
					placeholder={'Выберите школу'}
					style={{ borderRadius: '8px' }}
					size={'sm'}
					selectedKeys={school !== '' ? [school] : []}
					onChange={(e) => {
						setSchool(e.target.value)
					}}
				>
					{schools.map(school => {
						return <SelectItem key={Object.keys(school)[0]}
															 value={Object.values(school)[0]}>{Object.values(school)[0]}</SelectItem>
					})}

				</Select>
				<AlphaButton type={'submit'}>Войти</AlphaButton>
			</form>
			<section className={styles.hint}>
				Войдите с помощью данных, полученных от преподавателя или администрации
				школы.
			</section>
		</section>
	)
}

export default Page
