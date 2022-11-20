<template>
	<div
		class="bg-gray-100 p-4 rounded-lg"
		:class="{ 'flex-1': layout === 'fill' }"
	>
		Loading...
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		layout: 'default' | 'fill'
	}>()
</script>
