<template>
	<form @submit.prevent="handleSave">
		<div>
			<div class="mb-8 flex justify-between items-center">
				<h1>Settings</h1>
				<button type="submit">Save</button>
			</div>
		</div>
		<h2 class="my-4">Profile</h2>
		<div class="my-4" v-if="state.error === true">
			Error saving. Make sure your @handle is 3-20 chars. Only letters (a-z,
			A-Z), numbers, dash, dot and underscores are allowed.
		</div>

		<div
			class="my-4"
			v-if="typeof state.error === 'string' && state.error.length > 0"
		>
			{{ state.error }}
		</div>

		<div class="my-4" v-if="state.success">Successfull saved!</div>

		<div class="flex gap-6 flex-col">
			<label class="block w-80">
				<span class="text-sm block mb-1 text-gray-500">Name</span>
				<input v-model="currentUserInputState.name" class="w-full" required />
			</label>

			<label class="block w-80">
				<span class="text-sm block mb-1 text-gray-500">@handle</span>
				<input v-model="currentUserInputState.handle" class="w-full" required />
			</label>
		</div>
	</form>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import { Base } from '../../.nuxt/components'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	if (!currentUser.value) throw createError({ statusCode: 401 })

	definePageMeta({
		middleware: 'auth',
	})

	useHead({
		title: `Settings`,
	})

	const state = reactive({
		error: null as boolean | string | null,
		success: null as boolean | null,
	})

	const currentUserInputState = reactive({
		name: currentUser.value.name,
		handle: currentUser.value.handle,
	})

	const handleSave = async () => {
		state.error = null
		state.success = null

		const { data, error } = await useFetch('/api/currentUser', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				currentUser: {
					id: currentUser.value?.id,
					authId: currentUser.value?.authId,
					name: currentUserInputState.name,
					handle: currentUserInputState.handle,
				},
			},
		})
		if (error.value || !data.value) {
			if (error.value?.data.statusCode === 409)
				state.error = 'This @handle is already taken.'
			else state.error = true
			state.success = false
			return console.error(error)
		}
		state.success = true

		// If successful, update the user in the store
		currentUserStore.fetchCurrentUser()
	}
</script>
