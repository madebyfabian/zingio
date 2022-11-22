<template>
	<div class="flex flex-col gap-4 justify-center min-h-[80vh] items-center">
		<Card>
			<h1 class="text-center mb-4">Create an account 🚀</h1>
			<div v-if="state.status !== null" class="my-4">
				{{ state.status }}
				<div v-if="state.status">
					Please check your emails for a verification link.
				</div>
			</div>

			<form @submit.prevent="handleSubmit" class="w-64 flex flex-col gap-3">
				<input
					type="text"
					v-model="state.email"
					placeholder="Email"
					class="w-full"
				/>
				<input
					type="text"
					v-model="state.emailConfirm"
					placeholder="Confirm Email"
					class="w-full"
				/>
				<input
					type="password"
					v-model="state.password"
					placeholder="Password"
					class="w-full"
				/>
				<div class="flex flex-col gap-4 mt-4">
					<button type="submit">Signup</button>
					<button
						data-type="secondary"
						type="button"
						@click="() => $router.push('/auth/signin')"
					>
						Already have an Account?
					</button>
				</div>
			</form>
		</Card>
	</div>
</template>

<script setup lang="ts">
	const authUser = useAuthUser()

	definePageMeta({
		layout: 'auth',
	})

	const state = reactive({
		email: '',
		emailConfirm: '',
		password: '',
		status: null as null | 'error' | 'success',
	})

	watchEffect(() => {
		if (state.status === 'success' && authUser.value) navigateTo('/')
	})

	const handleSubmit = async () => {
		state.status = null

		const { data: newUserRecord, error } = useFetch('/api/auth/signup', {
			method: 'POST',
			body: {
				user: {
					email: state.email,
					password: state.password,
				},
			},
		})
		if (newUserRecord.value && !error.value) {
			state.status = 'success'
		} else {
			state.status = 'error'
		}
	}
</script>
