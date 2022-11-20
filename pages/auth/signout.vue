<template>
	<div>
		<div v-if="state.loading">Signing you out...</div>
		<div v-else>
			<p class="mb-4">You are now signed out.</p>
			<button @click="$router.push('/auth/signin')">Sign in again</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const supabaseClient = useSupabaseClient()

	const state = reactive({
		loading: true,
	})

	onMounted(async () => {
		const { error } = await supabaseClient.auth.signOut()
		if (!error) state.loading = false
	})
</script>
