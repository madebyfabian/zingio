<template>
	<div class="flex justify-center min-h-[80vh] items-center">
		<Card class="flex flex-col gap-4">
			<h1 class="text-center mb-4">Welcome back!</h1>

			<div v-if="state.status === 'success'" class="my-4">
				Succesfully signed in! If nothing happens, please refresh the page and
				try again (SSR error).
			</div>

			<div v-if="state.status === 'error'" class="my-4">
				{{ state.status }}: {{ state.error }}
			</div>

			<form @submit.prevent="handleSubmit" class="w-64 flex flex-col gap-3">
				<input
					type="text"
					v-model="state.email"
					placeholder="Email"
					class="w-full"
				/>
				<input
					type="password"
					v-model="state.password"
					placeholder="Password"
					class="w-full"
				/>
				<div class="flex flex-col gap-4 mt-4">
					<button type="submit">Sign In</button>
					<button
						data-type="secondary"
						type="button"
						@click="() => $router.push('/auth/signup')"
					>
						Create an account
					</button>
				</div>
			</form>
		</Card>
	</div>
</template>

<script setup lang="ts">
	const supabase = useSupabaseClient()
	const authUser = useAuthUser()

	definePageMeta({
		layout: 'auth',
	})

	const state = reactive({
		email: '',
		password: '',
		status: null as null | 'error' | 'success',
		error: null as null | string,
	})

	watchEffect(() => {
		if (state.status === 'success' && authUser.value) navigateTo('/')
	})

	const handleSubmit = async () => {
		state.status = null
		state.error = null

		const { data, error } = await supabase.auth.signInWithPassword({
			email: state.email,
			password: state.password,
		})
		if (!data || error) {
			state.status = 'error'
			state.error = error?.message ?? 'Unknown error'
			return
		}
		return (state.status = 'success')
	}
</script>
