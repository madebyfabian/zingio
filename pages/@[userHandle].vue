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
			:posts="userPosts"
			:pending="userPostsPending"
			type="feed"
			stateKey="userDetailPagePostList"
		/>

		<button v-if="userPostsPagination.nextPage" @click="() => loadUserPosts()">
			Load more
		</button>
	</div>
</template>

<script setup lang="ts">
	import type { BasePost } from '@/server/api/v2/feed/home'
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	const route = useRoute()

	// Fetch `userDetails`
	const { data: userDetails } = await useFetch('/api/v2/user/details', {
		headers: useRequestHeaders(['cookie']) as Record<string, any>,
		params: { userHandle: route.params.userHandle },
	})
	if (!userDetails.value)
		throw createError({ statusCode: 404, message: 'User not found' })

	const isCurrentUser = computed(() => {
		return currentUser.value?.id === userDetails.value?.id
	})

	useHead({
		title: `@${userDetails.value.handle}`,
	})

	const userPostsPending = useState(
		`userPostsPending:${userDetails.value.id}`,
		() => true
	)
	const userPosts = useState<BasePost[]>(
		`userPosts:${userDetails.value.id}`,
		() => []
	)
	const userPostsPagination = useState(
		`userPostsPagination:${userDetails.value.id}`,
		() => ({
			page: 0,
			nextPage: 0 as null | number,
			prevPage: null as null | number,
		})
	)

	onMounted(() => {
		loadUserPosts({ init: true })
	})

	// Fetch `userPosts`
	const loadUserPosts = async (options?: { init: boolean }) => {
		try {
			if (options?.init) {
				Object.assign(userPostsPagination.value, {
					page: 0,
					nextPage: 0,
					prevPage: null,
				})
			}

			const res = await $fetch('/api/v2/user/listPosts', {
				headers: useRequestHeaders(['cookie']) as Record<string, any>,
				params: {
					userHandle: route.params.userHandle,
					paginationPage: userPostsPagination.value.nextPage ?? 0,
				},
			})
			if (!res) throw createError({ statusCode: 500 })

			// Update `userPosts`
			userPosts.value = options?.init
				? res.posts
				: [...userPosts.value, ...res.posts]

			// Update `userPostsPagination`
			Object.assign(userPostsPagination.value, res.pagination)
		} catch (error) {
			console.error(error)
		} finally {
			if (userPostsPending.value === true) userPostsPending.value = false
		}
	}
</script>
