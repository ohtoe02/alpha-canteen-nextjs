export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'Alpha Canteen',
	description: 'Еда в школе на каждый день!',
	navItems: [
		{ label: 'Столовая', href: '/canteen' },
		{ label: 'Все блюда', href: '/dishes' },
		{ label: 'Семья', href: '/family' },
		{ label: 'История', href: '/history' },
		{ label: 'Заказы', href: '/orders' },
		{ label: 'Меню', href: '/menu' },
		{ label: 'Учитель', href: '/teacher' }
	],
	navMenuItems: [
		{ label: 'Столовая', href: '/canteen' },
		{ label: 'Все блюда', href: '/dishes' },
		{ label: 'Семья', href: '/family' },
		{ label: 'История', href: '/history' },
		{ label: 'Заказы', href: '/orders' },
		{ label: 'Меню', href: '/menu' },
		{ label: 'Учитель', href: '/teacher' }
	]
}
