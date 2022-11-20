<template>
	<PostCreateForm @submit="handleSubmit" />
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import { PostState } from '@/components/PostCreateForm.vue'
	const router = useRouter()
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)

	definePageMeta({
		middleware: 'auth',
	})

	const handleSubmit = async (postState: PostState) => {
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
					},
				},
			}
		)
		if (newPostError.value || !newPost.value) return console.error(newPostError)

		router.push(`/p/${newPost.value.id}`)
	}
</script>
