<template>
	<div class="flex flex-col gap-4 justify-center min-h-[80vh] items-center">
		<h1>Signup</h1>
		<form @submit.prevent="handleSubmit" class="w-64 flex flex-col gap-2">
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

		<div v-if="state.status !== null">
			{{ state.status }}
		</div>
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
	})

	watchEffect(() => {
		if (state.status === 'success' && authUser.value) navigateTo('/')
	})

	const handleSubmit = async () => {
		const { data, error } = await supabase.auth.signUp({
			email: state.email,
			password: state.password,
		})
		if (!data || error) {
			state.status = 'error'
			return
		}
		state.status = 'success'
	}
</script>
