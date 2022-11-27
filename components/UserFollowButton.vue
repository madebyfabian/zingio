<template>
	<button
		v-if="!isCurrentUser"
		:data-type="isFollowing ? 'secondary' : 'primary'"
		@click="handleFollowToggle"
	>
		{{ isFollowing ? 'Unfollow' : 'Follow' }}
	</button>
</template>

<script setup lang="ts">
	import type { UserDetail } from '@/server/api/v2/user/details'
	import type { UserListItemExtended } from '@/server/api/v2/user/list'
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)

	const props = defineProps<{
		user: NonNullable<UserDetail | UserListItemExtended>
	}>()

	const isFollowing = computed(() => props.user._currentUserIsFollowing)

	const isCurrentUser = computed(() => {
		return currentUser.value?.id === props.user.id
	})

	const handleFollowToggle = async () => {
		props.user._currentUserIsFollowing = !isFollowing.value

		const { data, error } = await useFetch('/api/v2/user/follow', {
			method: 'POST',
			headers: useRequestHeaders(['cookie']) as Record<string, any>,
			body: {
				userId: props.user.id,
			},
		})
		if (error.value || !data.value) return console.error(error.value)
	}
</script>
