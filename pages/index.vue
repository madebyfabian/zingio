<template>
	<div>
		<h1 class="mb-4">Hi, {{ currentUser?.name }} 👋</h1>

		<PostList
			:posts="data"
			:pending="pending"
			type="feed"
			stateKey="homepagePostList"
		/>
	</div>
</template>

<script lang="ts" setup>
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)

	definePageMeta({
		middleware: 'auth',
	})

	useHead({
		title: 'Your Feed',
	})

	const { data, pending } = useLazyFetch('/api/v2/feed/home', {
		headers: useRequestHeaders(['cookie']) as Record<string, any>,
	})
</script>
