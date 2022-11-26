<template>
	<div>
		<PostList
			:posts="data?.posts || null"
			type="detail"
			@openCommentForm="() => (state.isCommentFormOpen = true)"
			stateKey="postDetailEntryPostList"
		/>

		<section class="ml-6">
			<div v-if="state.isCommentFormOpen">
				<section class="bg-gray-100 p-6 my-6 rounded-xl">
					<PostCreateForm
						@submit="handleCommentCreate"
						hasCancelOption
						@cancel="() => (state.isCommentFormOpen = false)"
					/>
				</section>
			</div>

			<div v-if="data?.postComments.length" class="mt-6">
				<PostList
					:posts="data.postComments"
					type="feed"
					stateKey="postDetailEntryCommentsPostList"
				/>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import { PostState } from '@/components/PostCreateForm.vue'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	const route = useRoute()

	const state = reactive({
		isCommentFormOpen: false,
	})

	// Fetch `userDetails`
	const { data, refresh } = await useFetch('/api/postDetails', {
		headers: useRequestHeaders(['cookie']) as Record<string, any>,
		params: {
			postId: route.params.postId,
		},
	})
	if (!data.value) {
		throw createError({ statusCode: 404 })
	}

	useHead({
		title: `@${data.value.posts[0].authorUser?.name}: ${data.value.posts[0].content}`,
	})

	const handleCommentCreate = async (postState: PostState) => {
		const { data: newPost, error: newPostError } = await useFetch(
			'/api/v2/post/create',
			{
				method: 'POST',
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookies']),
				body: {
					post: {
						authorUser: {
							authId: currentUser.value?.authId,
						},
						content: postState.content,
						replyToPost: {
							id: data.value?.posts[0].id,
						},
					},
				},
			}
		)
		if (newPostError.value || !newPost.value)
			return console.error(newPostError.value)

		refresh()
		state.isCommentFormOpen = false
	}
</script>
