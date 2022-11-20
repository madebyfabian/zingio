<template>
	<div>
		<h1 class="mb-4">Welcome back, {{ currentUser?.name }}</h1>

		<section v-if="!currentUserFeedPending">
			<Post
				v-for="post of currentUserFeed"
				:key="post.id"
				:post="post"
				type="feed"
			/>
		</section>

		<LoadingIndicator v-else layout="fill" />
	</div>
</template>

<script lang="ts" setup>
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	if (!currentUser.value) throw createError({ statusCode: 401 })

	definePageMeta({
		middleware: 'auth',
	})

	// Fetch `currentUserFeed`
	const { data: currentUserFeed, pending: currentUserFeedPending } =
		useLazyFetch('/api/currentUserFeed', {
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
		})
</script>
