<template>
	<form @submit.prevent="handleSubmit">
		<div class="flex justify-between items-center">
			<h1>Create</h1>
			<button>🪶 Post</button>
		</div>

		<textarea
			v-model="postState.content"
			rows="5"
			class="w-96 border border-gray-200 rounded-lg mt-8 p-4"
		></textarea>
	</form>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const router = useRouter()
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)

	definePageMeta({
		middleware: 'auth',
	})

	const postState = reactive({
		content: '',
	})

	const handleSubmit = async () => {
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
