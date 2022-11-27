import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('useCurrentUser', () => {
	const fetchCurrentUser = async () => {
		try {
			const authUser = useSupabaseUser()
			if (!authUser.value) return

			const currentUserRes = await $fetch('/api/v2/account/details', {
				headers: useRequestHeaders(['cookie']) as Record<string, any>,
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
