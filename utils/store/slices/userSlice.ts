import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	login: null,
	school: null,
	role: null
}

const checkNull = (item: string|null) => {
	return item !== null ? item : '-1'
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.login = action.payload.login
			state.school = action.payload.school
			localStorage.setItem('login', checkNull(action.payload.login))
			localStorage.setItem('school', checkNull(action.payload.school))
		},
		removeUser(state) {
			state.login = null
			state.school = null
			localStorage.removeItem('login')
			localStorage.removeItem('school')
		}
	}
})

export const { setUser, removeUser } = userSlice.actions

export default userSlice.reducer
