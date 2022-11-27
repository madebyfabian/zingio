<template>
	<div>
		<pre>{{ res }}</pre>
	</div>
</template>

<script setup lang="ts">
	const res = await useFetch('/api/v2/admin/test', {
		headers: useRequestHeaders(['cookie']) as Record<string, any>,
	})
</script>
