'use client'

import { NavbarItem } from '@nextui-org/navbar'
import { useDispatch } from 'react-redux'
import { removeUser } from '@/utils/store/slices/userSlice'
import { useRouter } from 'next/navigation'

const LeaveButton = () => {
	const dispatch = useDispatch()
	const router = useRouter()

	const leaveHandler = () => {
		dispatch(removeUser())
		router.replace('/login')
	}


	return <NavbarItem className={'cursor-pointer text-red-500 hover:text-red-300 font-bold transition-all'} onClick={leaveHandler}>
		Выйти
	</NavbarItem>
}

export default LeaveButton;