<template>
	<div class="inline-flex items-baseline gap-1">
		<button
			v-if="props.asButton"
			:tabindex="0"
			role="link"
			@click.self="handleElementClick"
			@keydown.self.enter="handleElementClick"
			class="flex gap-1 reset hover:underline"
		>
			<span class="font-bold">
				{{ props.user.name }}
			</span>
			<span class="text-gray-500">@{{ props.user.handle }}</span>
		</button>
		<NuxtLink
			v-else
			:to="`/@${props.user.handle}`"
			class="flex gap-1 hover:underline"
		>
			<span class="font-bold">
				{{ props.user.name }}
			</span>
			<span class="text-gray-500">@{{ props.user.handle }}</span>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
	import type { UserListItem } from '@/server/api/v2/user/list'

	const props = defineProps<{
		user: UserListItem
		asButton?: boolean
	}>()

	const handleElementClick = (e: Event) => {
		e.stopPropagation()
		navigateTo(`/@${props.user.handle}`)
	}
</script>
