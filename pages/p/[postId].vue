<template>
	<div>
		<Post
			v-if="data?.post && data?.postLikes"
			:post="data.post"
			:postLikes="data.postLikes"
			@like="refresh"
			@openCommentForm="() => (state.isCommentFormOpen = true)"
			:postCommentsCount="data.postComments?.length"
			type="detail"
		/>

		<hr />

		<section class="ml-6">
			<div v-if="data?.postComments">
				<Post
					v-for="postComment of data.postComments"
					:key="postComment.id"
					:post="postComment"
					type="feed"
				/>
			</div>

			<div v-if="state.isCommentFormOpen">
				<section class="bg-gray-100 p-6 my-6 rounded-xl">
					<PostCreateForm
						@submit="handleCommentCreate"
						hasCancelOption
						@cancel="() => (state.isCommentFormOpen = false)"
					/>
				</section>
				<hr />
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
		params: {
			postId: route.params.postId,
		},
	})
	if (!data.value) {
		throw createError({ statusCode: 404 })
	}

	const handleCommentCreate = async (postState: PostState) => {
		const { data: newPost, error: newPostError } = await useFetch(
			'/api/currentUserCreatePost',
			{
				method: 'POST',
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookies']),
				body: {
					post: {
						authorUser: {
							id: currentUser.value?.id,
							authId: currentUser.value?.authId,
						},
						content: postState.content,
						isCommentOf: {
							id: data.value?.post.id,
						},
					},
				},
			}
		)
		if (newPostError.value || !newPost.value) return console.error(newPostError)

		refresh()
		state.isCommentFormOpen = false
	}
</script>
