import { createSlice } from '@reduxjs/toolkit'
import { dishType } from '@/utils/types/dishes/dishType'


const initialState: { [id: string]: dishType | null } = {
	mainDish: null,
	secondDish: null,
	drink: null
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setDish(state, action) {
			state[action.payload.type] = action.payload.dish
		},
		getCart(state) {
			return
		},
		removeDish(state, action) {
			state[action.payload.type] = null
		},
		clearCart(state) {
			state.mainDish = null
			state.secondDish = null
			state.drink = null
		}
	}
})

export const { setDish, removeDish, clearCart } = cartSlice.actions

export default cartSlice.reducer
