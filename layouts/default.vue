<template>
	<div>
		<div
			v-if="!currentUserPending"
			class="container min-h-screen grid grid-cols-12 gap-x-8"
		>
			<div class="col-span-3">
				<Sidebar />
			</div>
			<main class="col-span-9 py-8">
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
