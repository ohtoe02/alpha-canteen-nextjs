export type OrderType = {
	id: string
	dishes: {
		drink?: {
			first: string
			second: string
		}
		mainDish?: {
			first: string
			second: string
		}
		secondaryDish?: {
			first: string
			second: string
		}
	}
	info: {
		class: string
		kidId?: string
		kidName?: string
		parent: string
		price: string
		teacher?: string
		time?: string
	}
}
