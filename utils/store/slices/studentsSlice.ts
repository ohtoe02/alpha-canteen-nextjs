import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	students: null,
}

const studentsSlice = createSlice({
	name: 'students',
	initialState,
	reducers: {
		setStudents(state, action) {
			state.students = action.payload.students
		},
		clearStudents(state) {
			state.students = null
		}
	}
})

export const { setStudents, clearStudents } = studentsSlice.actions

export default studentsSlice.reducer
