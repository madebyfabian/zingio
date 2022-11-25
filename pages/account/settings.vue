<template>
	<form @submit.prevent="handleSave">
		<div>
			<div class="mb-8 flex justify-between items-center">
				<h1>Settings</h1>
				<div class="flex gap-3 items-center">
					<button
						type="button"
						@click="navigateTo(`/@${currentUser?.handle}`)"
						data-type="secondary"
					>
						Back to Profile
					</button>
					<button type="submit">Save</button>
				</div>
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

			<label class="block w-80">
				<span class="text-sm block mb-1 text-gray-500">Description</span>
				<textarea
					v-model="(currentUserInputState.description as string)"
					class="w-full"
					rows="7"
				/>
			</label>
		</div>

		<h2 class="mt-10">Login Providers</h2>

		<ul class="divide-y mt-4">
			<li
				v-for="identity of authUser?.identities"
				:key="identity.id"
				class="py-4 flex flex-wrap gap-x-8 gap-y-2"
			>
				<div class="capitalize font-bold w-40">{{ identity.provider }}</div>

				<div>
					<div class="text-gray-500 text-sm">Last used</div>
					<div>{{ formatDate(identity.last_sign_in_at) }}</div>
				</div>
			</li>
		</ul>
	</form>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const authUser = useSupabaseUser()
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
		description: currentUser.value.description,
	})

	const formatDate = (date: string) => {
		return new Date(date).toLocaleString()
	}

	const handleSave = async () => {
		state.error = null
		state.success = null

		const { data, error } = await useFetch('/api/currentUser', {
			method: 'POST',
			headers: useRequestHeaders(['cookie']) as Record<string, any>,
			body: {
				currentUser: {
					id: currentUser.value?.id,
					authId: currentUser.value?.authId,
					name: currentUserInputState.name,
					handle: currentUserInputState.handle,
					description: currentUserInputState.description,
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
