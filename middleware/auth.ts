export default defineNuxtRouteMiddleware(() => {
	const authUser = useSupabaseUser()
	if (!authUser.value) {
		return navigateTo('/auth/signin')
	}
})
