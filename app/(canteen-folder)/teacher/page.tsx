'use client'

import styles from './Teacher.module.scss'
import { useEffect, useState } from 'react'
import { useCredentials } from '@/hooks/use-auth'
import { child, get, getDatabase, ref, set, update } from 'firebase/database'
import AlphaButton from '@/components/ui/buttons/AlphaButton'
import { toast } from 'react-toastify'
import { useDispatch, useStore } from 'react-redux'
import { setStudents } from '@/utils/store/slices/studentsSlice'
import firebase_app from '@/utils/firabaseconfig'
import { useRouter } from 'next/navigation'
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox'
import Loading from '@/app/loading'

function Page(): JSX.Element {
	const currentDate = new Date().toDateString()
	const [teacherClasses, setTeacherClasses] = useState([])
	const [currentClass, setCurrentClass] = useState(null)
	const [absentList, setAbsentList] = useState<{ [id: string]: boolean }>({})
	const [checked, setChecked] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	// const setPageTitle: any = usePageTitle()
	const dispatch = useDispatch()
	const store = useStore()
	const { login, school } = useCredentials()
	const database = getDatabase(firebase_app)
	const router = useRouter()

	useEffect(() => {
		document.title = 'Мои классы'

		if (login !== 'userlogin') {
			router.replace('/login')
		}
		// setPageTitle('Мои классы')
		getClasses()
	}, [])

	const getClasses = async () => {
		try {
			const storedStudents: { [id: string]: boolean } =
				// @ts-ignore
				store.getState().students.students

			const userClasses = (
				await get(
					child(ref(database), `schools/${school}/users/${login}/classes`)
				)
			).val()
			setTeacherClasses(userClasses)
			const fetchedClass = (
				await get(
					child(ref(database), `schools/${school}/classes/${userClasses[0]}`)
				)
			).val()

			setCurrentClass(fetchedClass)
			// @ts-ignore
			let studentList: { [id: string]: boolean } = {}
			// @ts-ignore
			const ids: string[] = Object.values(fetchedClass.students).map(
				// @ts-ignore
				item => item['id']
			)
			ids.forEach(item => (studentList[item] = false))

			if (fetchedClass['checkDate'] == currentDate) {
				dispatch(setStudents({ students: fetchedClass['absent'] }))
				setAbsentList(fetchedClass['absent'])
			} else if (
				!storedStudents ||
				!Object.values(storedStudents).find(item => item)
			) {
				dispatch(setStudents({ students: studentList }))
				setAbsentList({ ...studentList, ...storedStudents })
			}
		} catch (e) {
			console.log('Error on fetching', e)
		} finally {
			setIsLoading(false)
		}
	}

	const submitAttendance = async () => {
		try {

			const submittedRequests = currentClass!['requests']
			const attendStudentsId: (string | null)[] = Object.entries(absentList)
				.map(item => (item[1] ? item[0] : null))
				.filter(item => item)
			const absentStudents = checked.reduce((o, key) => ({ ...o, [key]: true }), {})

			if (Object.hasOwn(submittedRequests, currentDate)) {
				const testIdd = Object.entries(submittedRequests[currentDate]).filter(
					// @ts-ignore
					item => attendStudentsId.includes(item[1]['info']['kidId'])
				)
				await set(
					child(
						ref(database),
						`schools/${school}/classes/${currentClass!['id']}/checkDate`
					),
					`${currentDate}`
				)
				await update(
					child(ref(database), `schools/${school}/requests/${currentDate}`),
					Object.fromEntries(testIdd)
				)
			}
			await set(
				child(
					ref(database),
					`schools/${school}/classes/${currentClass!['id']}/absent`
				),
				absentStudents
			)
		} catch (e) {
			throw new Error('Error on setting attendance')
		} finally {
			toast(`Посещаемость класса ${currentClass!['title']} отмечена!`)
		}
	}

	return (
		<div className={styles.wrapper}>
			<section>
				<h3 className={'text-2xl'}>Все мои классы</h3>
				{isLoading ? (
					'Загрузка'
				) : (
					<div className={styles['class-list']}>
						{teacherClasses.map((item: any) => (
							<div className={styles.class} key={item.name + '11'}>
								<p className={styles.classname}>{currentClass!['title']}</p>
								<div className={styles.classdivider}></div>
								<p>11:15 - 12:00</p>
								<div className={styles.classdivider}></div>
								<p className={styles.classPopulation}>
									{currentClass!['studentsCount']} чел.
								</p>
							</div>
						))}
					</div>
				)}
			</section>
			<div className={styles.divider}></div>
			<section>
				{isLoading ? (
					<Loading />
				) : (
					<>
						<h3 className={'mb-4 text-2xl '}>
							Ближайший на питание - {currentClass!['title']}
						</h3>
						<CheckboxGroup value={checked} onValueChange={setChecked} color={'primary'}
													 className={'w-full divide-y overflow-scroll scrollbar-hide border-slate-900 border-1 rounded-medium p-4 mb-6'}>
							{Object.values(currentClass!['students']).map((item: any) => (
									<Checkbox size={'lg'} className={'w-fit '} key={item.id}
														value={item.id}>{item.name}</Checkbox>
							))}
						</CheckboxGroup>
						<div className={`${styles.bottom} m-0`}>
							<AlphaButton clickHandler={submitAttendance}>
								Отметить отсутствующих
							</AlphaButton>
						</div>
					</>
				)}
			</section>
		</div>
	)
}

export default Page
