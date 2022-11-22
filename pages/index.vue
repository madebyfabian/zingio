<template>
	<div>
		<h1 class="mb-4">Hi, {{ currentUser?.name }} 👋</h1>

		<PostList
			v-if="data?.length"
			:posts="data"
			type="feed"
			stateKey="homepagePostList"
		/>
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
	const { data } = useLazyFetch('/api/currentUserFeed', {
		// @ts-expect-error - this is a valid option
		headers: useRequestHeaders(['cookie']),
	})
</script>
