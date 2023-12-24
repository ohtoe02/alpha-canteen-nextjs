'use client'
import { useRouter } from 'next/navigation'

function NavigateTo ({ type, path }: { type: 'push' | 'replace', path: string })  {
	const router = useRouter()

	type === 'push' ? router.push(path) : router.replace(path)

	return null
}

export default NavigateTo