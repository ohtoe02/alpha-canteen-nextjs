'use client'
import { useRouter } from 'next/navigation'

export const NavigateTo = ({ type, path }: { type: 'push' | 'replace', path: string }) => {
	const router = useRouter()

	const actions = {
		'replace': router.replace,
		'push': router.push
	}

	type === 'push' ? router.push(path) : router.replace(path)

	return <></>
}