<template>
	<div>
		<div>Signing you out...</div>
	</div>
</template>

<script setup lang="ts">
	const supabaseClient = useSupabaseClient()
	const authUser = useAuthUser()

	const state = reactive({
		loading: true,
	})

	onMounted(async () => {
		const { error } = await supabaseClient.auth.signOut()
		if (!error) state.loading = false
	})

	watchEffect(() => {
		if (!state.loading && !authUser.value) navigateTo('/auth/signin')
	})
</script>
