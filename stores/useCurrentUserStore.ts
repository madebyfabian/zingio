import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('useCurrentUser', () => {
	const fetchCurrentUser = async () => {
		try {
			const currentUserRes = await $fetch('/api/currentUser', {
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookie']),
			})
			currentUser.value = currentUserRes
			return currentUserRes
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
