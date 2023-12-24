import '@/styles/globals.scss'
import { Navbar } from '@/components/navbar'
import { UnauthCheck } from '@/utils/navigation/unauth'


export default function CanteenLayout({
																		 children
																	 }: {
	children: React.ReactNode;
}) {

	return (
		<main>
			<UnauthCheck />
			<div className='relative flex flex-col h-screen'>
				<Navbar />
				<main className='container mx-auto max-w-7xl flex-grow p-4 xl:py-16'>
					{children}
				</main>
			</div>
		</main>
	)
}
