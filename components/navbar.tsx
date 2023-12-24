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


export const Navbar = () => {
	return (
		<NextUINavbar maxWidth='xl' position='sticky' isBordered>
			<NavbarContent className='hidden lg:flex basis-1/5 sm:basis-full' justify='center'>
				<ul className='flex gap-4 ml-2'>
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
				</ul>
				<LeaveButton />
			</NavbarContent>
		</NextUINavbar>
	)
}
