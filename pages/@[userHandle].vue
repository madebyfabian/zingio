<template>
	<div v-if="userDetails">
		<div class="flex justify-between items-center">
			<h1 class="mb-0">{{ userDetails?.name }}</h1>
			<UserFollowButton :user="userDetails" />
		</div>
		<p class="mt-0 font-normal text-gray-500">@{{ userDetails?.handle }}</p>

		<hr class="my-10" />

		<PostList
			v-if="userPosts?.length"
			:posts="userPosts"
			type="feed"
			@requestRefresh="refreshUserPosts"
		/>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute()

	// Fetch `userDetails`
	const { data: userDetails, refresh: refreshUserDetails } = await useFetch(
		'/api/userDetails',
		{
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			params: { userHandle: route.params.userHandle },
		}
	)
	if (!userDetails.value)
		throw createError({ statusCode: 404, message: 'User not found' })

	// Fetch `userPosts`
	const { data: userPosts, refresh: refreshUserPosts } = useLazyFetch(
		'/api/userPosts',
		{
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			params: { userHandle: route.params.userHandle },
		}
	)
</script>
