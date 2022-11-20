export default defineNuxtRouteMiddleware(() => {
	const authUser = useAuthUser()
	if (!authUser.value) {
		return navigateTo('/auth/signup')
	}
})
