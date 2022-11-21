<template>
	<div>
		<button class="w-full" @click="state.dialogOpen = true">
			💬 Create something!
		</button>
		<UIDialog :isOpen="state.dialogOpen" @close="state.dialogOpen = false">
			<div class="mt-8">
				<PostCreateForm
					hasCancelOption
					@submit="handleSubmit"
					@cancel="() => (state.dialogOpen = false)"
				/>
			</div>
		</UIDialog>
	</div>
</template>

<script lang="ts" setup>
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import { PostState } from '@/components/PostCreateForm.vue'
	const router = useRouter()
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)

	const state = reactive({
		dialogOpen: false,
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

		state.dialogOpen = false

		router.push(`/p/${newPost.value.id}`)
	}
</script>
