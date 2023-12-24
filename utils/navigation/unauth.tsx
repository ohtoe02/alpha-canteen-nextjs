'use client'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const UnauthCheck = () => {
	const { isAuth } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuth) {
			router.push('/login');
		}
	}, [isAuth, router]);

	return null;
}