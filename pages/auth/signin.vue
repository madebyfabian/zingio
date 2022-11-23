<template>
	<div class="flex flex-col gap-8 justify-center min-h-[80vh] items-center">
		<Logo class="mx-auto mb-4" />

		<Card class="flex w-80 flex-col gap-4">
			<h1 class="text-center">Welcome back!</h1>

			<div v-if="state.status === 'error'" class="my-4">
				{{ state.status }}: {{ state.error }}
			</div>

			<button type="button" @click="handleAuthWithGitHub">
				Sign in with GitHub
			</button>

			<div
				class="text-xs text-center bg-gray-200 h-[1px] w-full flex items-center justify-center my-6"
			>
				<span class="bg-white px-4">or</span>
			</div>

			<form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
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
	const supabaseAuth = useSupabaseAuthClient()
	const authUser = useSupabaseUser()
	const runtimeConfig = useRuntimeConfig()

	definePageMeta({
		layout: 'auth',
	})

	useHead({
		title: `Sign in`,
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

	const handleAuthWithGitHub = async () => {
		const { data, error } = await supabaseAuth.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: runtimeConfig.public.redirectUrl,
			},
		})
		if (error) {
			state.status = 'error'
			state.error = error.message
		} else {
			state.status = 'success'
		}
	}

	const handleSubmit = async () => {
		state.status = null
		state.error = null

		const { data, error } = await supabaseAuth.auth.signInWithPassword({
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
