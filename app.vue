<template>
	<NuxtLayout>
		<NuxtLoadingIndicator />
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
	const supabaseAuth = useSupabaseAuthClient()
	const authUser = useSupabaseUser()

	onMounted(() => {
		supabaseAuth.auth.onAuthStateChange(async (event, session) => {
			switch (event) {
				case 'SIGNED_IN':
					// If there already is a user, don't redirect.
					if (authUser.value?.id) break

					// Wait for a bit to make sure the session was synced with server. (Ugh, Bug or smth).
					await new Promise(resolve => setTimeout(resolve, 250))
					navigateTo('/')
					break

				case 'SIGNED_OUT':
					navigateTo('/auth/signin')
					break

				default:
					break
			}
		})
	})
</script>
