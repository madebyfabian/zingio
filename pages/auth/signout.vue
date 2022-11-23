<template>
	<div>
		<div>Signing you out...</div>
	</div>
</template>

<script setup lang="ts">
	const supabaseAuth = useSupabaseAuthClient()
	const authUser = useSupabaseUser()

	useHead({
		title: `Signing you out...`,
	})

	const state = reactive({
		loading: true,
	})

	onMounted(async () => {
		const { error } = await supabaseAuth.auth.signOut()
		if (!error) state.loading = false
	})

	watchEffect(() => {
		if (!state.loading && !authUser.value) navigateTo('/auth/signin')
	})
</script>
