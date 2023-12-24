
type Credential = string | null


export function useAuth() {

	let login: Credential = null

	if (typeof window !== 'undefined') {
		login = localStorage.getItem('login')
	}

	return {
		isAuth: !!login,
		login
	}
}

export function useCredentials() {

	let login: Credential = null
	let school: Credential = null

	if (typeof window !== 'undefined') {
		login = localStorage.getItem('login')
		school = localStorage.getItem('school')
	}

	return {
		login,
		school
	}
}
