<template>
	<div class="flex flex-col gap-8 justify-center min-h-[80vh] items-center">
		<Logo class="mx-auto mb-4" />

		<Card class="flex w-80 flex-col gap-4">
			<h1 class="text-center">Create an account 🚀</h1>

			<div v-if="state.status === 'success'" class="my-4">
				Please check your emails for a verification link.
			</div>

			<div v-if="state.status === 'error'" class="my-4">
				{{ state.status }}
			</div>

			<button type="button" @click="handleAuthWithGitHub">
				Sign up with GitHub
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
	const supabase = useSupabaseClient()
	const runtimeConfig = useRuntimeConfig()

	definePageMeta({
		layout: 'auth',
	})

	useHead({
		title: `Sign up`,
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

	const handleAuthWithGitHub = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: runtimeConfig.public.redirectUrl,
			},
		})
		if (error) {
			state.status = 'error'
		} else {
			state.status = 'success'
		}
	}

	const handleSubmit = async () => {
		state.status = null

		const { data: newUserRecord, error } = await useFetch('/api/auth/signup', {
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
