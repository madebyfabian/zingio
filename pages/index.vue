<template>
	<div>
		<pre>{{ currentUserStore.currentUser }}</pre>
	</div>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'

	const currentUserStore = useCurrentUserStore()

	onMounted(() => {
		currentUserStore.fetchCurrentUser()
	})
</script>
