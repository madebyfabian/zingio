<template>
	<div class="inline-flex items-baseline gap-1">
		<NuxtLink :to="`/@${props.user.handle}`" class="font-bold hover:underline">
			{{ props.user.name }}
		</NuxtLink>
		<div class="text-gray-500">@{{ props.user.handle }}</div>
	</div>
</template>

<script setup lang="ts">
	import type { User } from '@/server/lib/xata/gen/client.gen'

	const props = defineProps<{
		user: User
	}>()
</script>
