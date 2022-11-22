<template>
	<form @submit.prevent="handleSave">
		<div class="flex justify-between items-center">
			<h1>Settings</h1>
			<button type="submit">Save</button>
		</div>

		<label class="mt-4 block">
			<span>Name</span>
			<input v-model="currentUserInputState.name" />
		</label>
	</form>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	if (!currentUser.value) throw createError({ statusCode: 401 })

	definePageMeta({
		middleware: 'auth',
	})

	useHead({
		title: `Settings`,
	})

	const currentUserInputState = reactive({
		name: currentUser.value.name,
	})

	const handleSave = async () => {
		const { data, error } = await useFetch('/api/currentUser', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				currentUser: {
					id: currentUser.value?.id,
					authId: currentUser.value?.authId,
					name: currentUserInputState.name,
				},
			},
		})
		if (error.value || !data.value) return console.error(error)

		// If successful, update the user in the store
		currentUserStore.fetchCurrentUser()
	}
</script>
