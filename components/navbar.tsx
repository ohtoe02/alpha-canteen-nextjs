'use client'

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarItem
} from '@nextui-org/navbar'

import { link as linkStyles } from '@nextui-org/theme'

import { siteConfig } from '@/config/site'
import NextLink from 'next/link'
import clsx from 'clsx'

import { ThemeSwitch } from '@/components/theme-switch'

import { useDispatch } from 'react-redux'
import { removeUser } from '@/utils/store/slices/userSlice'
import LeaveButton from '@/components/ui/LeaveButton'
import { usePathname } from 'next/navigation'


export const Navbar = () => {
	const pageName = usePathname()


	return (
		<NextUINavbar maxWidth='xl' position='sticky' isBordered>
			<NavbarContent className='basis-full' justify='center' >
				<ul className='hidden lg:flex gap-4 ml-2'>
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: 'foreground' }),
									'data-[active=true]:text-primary data-[active=true]:font-medium'
								)}
								color='foreground'
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
					<LeaveButton />
				</ul>
				<h1 className={'block lg:hidden text-2xl font-bold'}>{siteConfig.navItems.filter(item => item.href === pageName)[0].label}</h1>
			</NavbarContent>
		</NextUINavbar>
	)
}
