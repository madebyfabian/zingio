<template>
	<div>
		<PostList
			v-if="currentPost"
			:posts="[currentPost]"
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

		<pre>{{ data }}</pre>
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

	const { data, refresh } = await useFetch('/api/v2/post/details', {
		headers: useRequestHeaders(['cookie']) as Record<string, any>,
		params: {
			postId: route.params.postId,
		},
	})
	if (!data.value?.post) {
		throw createError({ statusCode: 404 })
	}

	const currentPost = computed(() => data.value?.post || null)

	useHead({
		title: `@${currentPost.value?.authorUser?.name}: ${currentPost.value?.content}`,
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
							id: currentPost.value?.id,
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
