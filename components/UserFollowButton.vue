<template>
	<button
		:data-type="isFollowing ? 'secondary' : 'primary'"
		@click="handleFollowToggle"
	>
		{{ isFollowing ? 'Unfollow' : 'Follow' }}
	</button>
</template>

<script setup lang="ts">
	import type { User } from '@/server/lib/xata/gen/client.gen'
	import { UserExtension } from '@/types'

	const props = defineProps<{
		user: User & UserExtension
	}>()

	const isFollowing = computed(() => props.user?.currentUser?.isFollowing)

	const handleFollowToggle = async () => {
		if (typeof props?.user?.currentUser?.isFollowing === 'boolean')
			props.user.currentUser.isFollowing = !isFollowing.value

		const { data, error } = await useFetch('/api/currentUserIsFollowingUser', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				userId: props.user.id,
			},
		})
		if (error.value || !data.value) return console.error(error)
	}
</script>
