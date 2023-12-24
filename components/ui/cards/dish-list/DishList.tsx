'use client'

import { dishType } from '@/utils/types/dishes/dishType'
import DishCard from '../dish-card/DishCard'
import { cache, useState } from 'react'
import { Card, CardBody } from '@nextui-org/card'
import { Pagination } from '@nextui-org/pagination'

export const revalidate = 300

function DishList({
										dishes,
										cart,
										category,
										chooseHandler
									}: {
	dishes: dishType[]
	cart: { [id: string]: dishType | null }
	category: string
	chooseHandler: (id: dishType | null) => void
}): JSX.Element {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsOnPage = matchMedia('(max-width: 1024px)').matches ? 4 : 5
	const maxPages = Math.ceil(dishes.length / itemsOnPage)

	const selectHandler = (event: any, dish: dishType) => {
		const newDish = cart[category]?.id === dish?.id ? null : dish
		chooseHandler(newDish)
	}

	const currentDishes = dishes.slice(
		itemsOnPage * (currentPage - 1),
		Math.min(itemsOnPage * currentPage, dishes.length)
	)

	return (
		<div className={'flex flex-col items-center '}>
			{/*<h3 className={"text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center "}>{title}</h3>*/}
			<Card shadow={'none'} className={'mb-8'}>
				<CardBody >
					{/*<section className={'grid grid-cols-2 xl:grid-cols-3 gap-4 grid-rows-2'}>*/}
					{/*	{currentDishes.map(dish => {*/}
					{/*		return (*/}
					{/*			<DishCard*/}
					{/*				key={dish!.id}*/}
					{/*				id={dish!.id}*/}
					{/*				isSelected={dish!.id === cart[category]?.id}*/}
					{/*				selectHandler={(event: any) => {*/}
					{/*					selectHandler(event, dish)*/}
					{/*				}}*/}
					{/*				dish={dish}*/}
					{/*			/>*/}
					{/*		)*/}
					{/*	})}*/}
					{/*</section>*/}
					<section className={'grid grid-cols-2 gap-4 auto-rows-max'}>
						{currentDishes.map(dish => {
							return (
								<DishCard
									key={dish!.id}
									id={dish!.id}
									isSelected={dish!.id === cart[category]?.id}
									selectHandler={(event: any) => {
										selectHandler(event, dish)
									}}
									dish={dish}
								/>
							)
						})}
					</section>
				</CardBody>
			</Card>
			<Pagination loop showControls size={'lg'} initialPage={1}
									classNames={{ next: 'text-slate-900', prev: 'text-slate-900', item: 'text-slate-900' }}
									color={'secondary'} total={maxPages} page={currentPage} onChange={(page) => {
				setCurrentPage(page)
			}} />
			{/*<div className={`${styles.pagination} flex w-4/5 justify-center items-center gap-8`}>*/}
			{/*	<button*/}
			{/*		className={'text-3xl disabled:text-gray-400 disabled:border-gray-400 border-1 border-slate-950 p-4 rounded-medium w-12 h-12 flex justify-center items-center leading-tight'}*/}
			{/*		onClick={() => setCurrentPage(currentPage - 1)}*/}
			{/*		disabled={currentPage <= 1}*/}
			{/*	>*/}
			{/*		{`<`}*/}
			{/*	</button>*/}
			{/*	<p className={'text-3xl'}>{currentPage}</p>*/}
			{/*	<button*/}
			{/*		className={'text-3xl disabled:text-gray-400 disabled:border-gray-400 border-1 border-slate-950 p-4 rounded-medium w-12 h-12 flex justify-center items-center'}*/}
			{/*		onClick={() => {*/}
			{/*			setCurrentPage(currentPage + 1)*/}
			{/*		}}*/}
			{/*		disabled={maxPages === currentPage}*/}
			{/*	>*/}
			{/*		{`>`}*/}
			{/*	</button>*/}
			{/*</div>*/}
		</div>
	)
}

export default DishList
