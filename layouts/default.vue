<template>
	<div>
		<div
			v-if="!currentUserPending"
			class="container min-h-screen lg:flex lg:gap-x-8"
		>
			<div class="hidden lg:block relative w-56 shrink-0">
				<Sidebar />
			</div>

			<div class="block lg:hidden h-20">
				<div class="flex justify-between items-center h-full">
					<Logo />
					<details>
						<summary class="relative z-20">Menu</summary>
						<div class="fixed top-0 right-0 w-full p-3">
							<div class="bg-white rounded-xl shadow-2xl p-4">
								<Sidebar asMenu />
							</div>
						</div>
					</details>
				</div>
			</div>

			<main class="lg:col-span-9 py-8 lg:flex-1">
				<slot />
			</main>
		</div>

		<div v-else class="flex justify-center min-h-[80vh] items-center">
			<LoadingIndicator layout="default" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()

	const { pending: currentUserPending } = useLazyAsyncData(
		'currentUser',
		async () => {
			return await currentUserStore.fetchCurrentUser()
		}
	)
</script>
