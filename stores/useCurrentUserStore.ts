import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('useCurrentUser', () => {
	const fetchCurrentUser = async () => {
		try {
			const currentUserRes = await useFetch('/api/currentUser')
			const currentUserData = currentUserRes.data.value
			currentUser.value = currentUserData

			return currentUserData
		} catch (error) {
			console.error(error)

			return null
		}
	}

	type CurrentUserType = Awaited<ReturnType<typeof fetchCurrentUser>>
	const currentUser = ref<CurrentUserType>(null)

	return {
		currentUser,
		fetchCurrentUser,
	}
})
