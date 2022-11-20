<template>
	<div class="inline-flex items-baseline gap-1">
		<button
			v-if="props.asButton"
			:tabindex="0"
			role="link"
			@click.self="handleElementClick"
			@keydown.self.enter="handleElementClick"
			class="reset font-bold hover:underline"
		>
			{{ props.user.name }}
		</button>
		<NuxtLink
			v-else
			:to="`/@${props.user.handle}`"
			class="font-bold hover:underline"
		>
			{{ props.user.name }}
		</NuxtLink>
		<div class="text-gray-500">@{{ props.user.handle }}</div>
	</div>
</template>

<script setup lang="ts">
	import type { User } from '@/server/lib/xata/gen/client.gen'

	const props = defineProps<{
		user: User
		asButton?: boolean
	}>()

	const handleElementClick = (e: Event) => {
		e.stopPropagation()
		navigateTo(`/@${props.user.handle}`)
	}
</script>
