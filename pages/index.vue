<template>
	<div>
		<h1>Hi!</h1>
		<pre>{{ currentUser }}</pre>
	</div>
</template>

<script lang="ts" setup>
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
</script>
