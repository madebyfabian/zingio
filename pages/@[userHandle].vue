<template>
	<div v-if="userDetails">
		<div class="flex justify-between items-center">
			<div class="flex gap-4 items-center">
				<div
					class="rounded-full h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-300"
				></div>
				<div>
					<h1 class="mb-0">{{ userDetails?.name }}</h1>
					<p class="mt-0 font-normal text-gray-500">
						@{{ userDetails?.handle }}
					</p>
				</div>
			</div>
			<button
				v-if="isCurrentUser"
				data-type="secondary"
				@click="() => navigateTo('/account/settings')"
			>
				✏️ Edit
			</button>
			<UserFollowButton v-if="!isCurrentUser" :user="userDetails" />
		</div>

		<p
			v-if="userDetails.description?.length"
			class="whitespace-pre-wrap mt-4 max-w-lg"
		>
			{{ userDetails.description }}
		</p>

		<hr class="my-10" />

		<PostList
			v-if="userPosts?.length"
			:posts="userPosts"
			type="feed"
			stateKey="userDetailPagePostList"
		/>

		<button v-if="userPostsMeta?.page?.more" @click="loadUserPosts">
			Load more
		</button>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute()
	const authUser = useAuthUser()

	// Fetch `userDetails`
	const { data: userDetails } = await useFetch('/api/userDetails', {
		// @ts-expect-error - this is a valid option
		headers: useRequestHeaders(['cookie']),
		params: { userHandle: route.params.userHandle },
	})
	if (!userDetails.value)
		throw createError({ statusCode: 404, message: 'User not found' })

	const isCurrentUser = computed(() => {
		return authUser.value?.id === userDetails.value?.authId
	})

	useHead({
		title: `@${userDetails.value.handle}`,
	})

	const userPosts = useState(`userPosts:${userDetails.value.id}`, () => [])
	const userPostsMeta = useState<{
		page?: { more: boolean; cursor: string }
	}>(`userPosts:${userDetails.value.id}:meta`, () => ({
		page: undefined,
	}))

	onMounted(() => {
		loadUserPosts()
	})

	// Fetch `userPosts`
	const loadUserPosts = async () => {
		const paginationCursor = userPostsMeta.value.page?.cursor

		try {
			const res = await $fetch('/api/userPosts', {
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookie']),
				params: {
					userHandle: route.params.userHandle,
					paginationCursor: paginationCursor ?? undefined,
				},
			})
			if (!res) throw createError({ statusCode: 500 })

			userPosts.value = [...userPosts.value, ...(res.records as never[])]
			userPostsMeta.value = res.meta
		} catch (error) {
			console.error(error)
		}
	}
</script>
