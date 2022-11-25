<template>
	<Card
		:tabindex="isLink ? 0 : undefined"
		:role="isLink ? 'link' : undefined"
		@click="handleElementClick"
		@keydown.enter="handleElementClick"
		class="Post mb-6"
		:isInteractive="isLink"
		:class="{
			'cursor-pointer': isLink,
			'!shadow-lg': !isLink,
		}"
	>
		<template v-if="!isDeleted">
			<UserLink
				v-if="postState.authorUser"
				:user="postState.authorUser"
				asButton
			/>

			<p
				:class="{
					'text-xl mt-3 mb-5': _props.type === 'detail',
					'mt-2': _props.type === 'feed',
				}"
			>
				{{ postState.content }}
			</p>

			<nav class="flex flex-wrap justify-between mt-4">
				<div class="flex gap-3 items-center flex-wrap">
					<button
						@click.stop="handlePostLike"
						:data-type="isLikedByCurrUser ? 'secondaryActive' : 'secondary'"
						class="gap-1"
					>
						👍 Like —
						<span class="font-bold">{{ postState._count_postReactions }}</span>
					</button>

					<button
						@click.stop="() => emit('openCommentForm')"
						data-type="secondary"
						class="gap-1"
					>
						💬 Comment —
						<span>{{ postState._count_postComments }}</span>
					</button>

					<button
						data-type="secondary"
						@click.stop="state.bookmarkDialogOpen = true"
					>
						🔖 Bookmark
					</button>
					<UIDialog
						:isOpen="state.bookmarkDialogOpen"
						@close="state.bookmarkDialogOpen = false"
					>
						<PostBookmarkDialogForm
							v-if="state.bookmarkDialogOpen"
							:postId="postState.id"
							@afterSubmit="handleAfterPostBookmarkSubmit"
						/>
					</UIDialog>
				</div>

				<div class="flex gap-3 items-center">
					<button
						v-if="currentUser?.id === postState.authorUser?.id"
						@click.stop="handleDeletePost"
						data-type="secondary"
						class="gap-1"
					>
						🗑️ Delete
					</button>
				</div>
			</nav>
		</template>

		<div v-else class="italic">This post has been deleted.</div>
	</Card>
</template>

<script lang="ts">
	export type PostProps = {
		post: BasePost
		type: 'detail' | 'feed'
	}
</script>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import type { EmitReturnAction } from '@/components/PostBookmarkDialogForm.vue'
	import type { BasePost } from '@/server/api/v2/feed/home'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	const router = useRouter()
	const authUser = useSupabaseUser()

	const _props = defineProps<{
		post: PostProps['post']
		type: PostProps['type']
	}>()

	const emit = defineEmits<{
		(e: 'postDeleted', postId: string): void
		(e: 'bookmarkChanged', postId: string, returnAction: EmitReturnAction): void
		(e: 'openCommentForm'): void
	}>()

	const state = reactive({
		bookmarkDialogOpen: false,
	})

	const postState = useState<typeof _props.post>(
		`postState:${_props.post.id}`,
		() => JSON.parse(JSON.stringify(_props.post))
	)
	watch(
		() => _props.post,
		newPost => {
			postState.value = JSON.parse(JSON.stringify(newPost))
		},
		{ deep: true }
	)

	const isDeleted = computed(() => Boolean(postState.value.isDeleted))
	const isLink = computed(() => _props.type === 'feed')
	const isLikedByCurrUser = computed(
		() => postState.value._currentUserPostReaction
	)

	const handleElementClick = (e: Event) => {
		e.stopPropagation()
		if (isLink.value) {
			router.push(`/p/${postState.value.id}`)
		}
	}

	const handlePostLike = async () => {
		const newState = !isLikedByCurrUser.value
		postState.value._currentUserPostReaction = newState
		postState.value._count_postReactions += newState ? 1 : -1

		const { data, error } = await useFetch('/api/currentUserPostLike', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				postId: postState.value.id,
				user: {
					id: currentUser.value?.id,
					authId: authUser.value?.id,
				},
			},
		})
		if (error.value || !data.value) return console.error(error)
	}

	const handleDeletePost = async () => {
		const { data, error } = await useFetch('/api/postDelete', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				post: {
					authorUser: {
						id: currentUser.value?.id,
						authId: authUser.value?.id,
					},
					id: postState.value.id,
				},
			},
		})
		if (error.value || !data.value) return console.error(error)

		return emit('postDeleted', postState.value.id)
	}

	const handleAfterPostBookmarkSubmit = (returnAction: EmitReturnAction) => {
		state.bookmarkDialogOpen = false
		emit('bookmarkChanged', postState.value.id, returnAction)
	}
</script>
