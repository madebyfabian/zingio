<template>
	<div>
		<div class="flex justify-between items-center">
			<h1 class="mb-0">{{ userDetails?.name }}</h1>
			<button
				v-if="userDetails?.authId !== user?.id"
				@click="handleFollowToggle"
			>
				{{ currentUserIsFollowingUser ? 'Unfollow' : 'Follow' }}
			</button>
		</div>
		<p class="mt-0 font-normal text-gray-500">@{{ userDetails?.handle }}</p>
		<hr class="my-10" />
		<div>
			<div v-if="!pendingUserPosts">
				<Post
					v-for="post of userPosts"
					:key="post.id"
					:post="post"
					type="feed"
				/>
			</div>
			<LoadingIndicator v-else layout="fill" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute()
	const user = useSupabaseUser()

	// Fetch `userDetails`
	const { data: userDetails } = await useFetch('/api/userDetails', {
		params: { userHandle: route.params.userHandle },
	})
	if (!userDetails.value)
		throw createError({ statusCode: 404, message: 'User not found' })

	// Fetch `currentUserIsFollowingUser`
	const {
		data: currentUserIsFollowingUser,
		refresh: refreshCurrentUserIsFollowingUser,
	} = useLazyFetch('/api/currentUserIsFollowingUser', {
		// @ts-expect-error - this is a valid option
		headers: useRequestHeaders(['cookie']),
		params: { userId: userDetails.value.id },
	})

	// Fetch `userPosts`
	const { data: userPosts, pending: pendingUserPosts } = useLazyFetch(
		'/api/userPosts',
		{ params: { userHandle: route.params.userHandle } }
	)

	const handleFollowToggle = async () => {
		const userId = userDetails.value?.id
		if (!userId) return

		const { data, error } = await useFetch('/api/currentUserIsFollowingUser', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				userId,
			},
		})
		if (error.value || !data.value) return console.error(error)

		refreshCurrentUserIsFollowingUser()
	}
</script>
