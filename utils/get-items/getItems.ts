import { cache } from 'react'
import { Database, child, get, getDatabase, ref } from 'firebase/database'
import firebase_app from '@/utils/firabaseconfig'
import { useCredentials } from '@/hooks/use-auth'


export const getDishes = cache(async () => {
	const { school } = useCredentials()

	try {
		return await getFromDatabase(`schools/${school}/menu/dishes/`)
	} catch (e) {
		console.log('Error on fetching', e)
	}
})

const getFromDatabase: (path: string) => Promise<any> = cache(async (path: string) => {
	const database = getDatabase(firebase_app)

	try {
		const dbRef = child(ref(database), path)
		const snapshot = await get(dbRef)
		return await snapshot.val()
	} catch (e) {
		console.log('Error on fetching', e)
	}
})