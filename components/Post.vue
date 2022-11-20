<template>
	<article
		:tabindex="isLink ? 0 : undefined"
		:role="isLink ? 'link' : undefined"
		@click="handleElementClick"
		@keydown.enter="handleElementClick"
		class="Post block bg-white border border-gray-200 rounded-xl p-6 mb-6"
		:class="{
			'cursor-pointer': isLink,
			'shadow-lg': !isLink,
		}"
	>
		<template v-if="!isDeleted">
			<UserLink
				v-if="props.post.authorUser"
				:user="props.post.authorUser"
				asButton
			/>

			<p
				:class="{
					'text-xl mt-3 mb-5': props.type === 'detail',
					'mt-2': props.type === 'feed',
				}"
			>
				{{ props.post.content }}
			</p>

			<nav class="flex justify-between mt-4">
				<div class="flex gap-3 items-center">
					<button
						@click.stop="handlePostLike"
						:data-type="isLikedByCurrUser ? 'primary' : 'secondary'"
						class="gap-1"
					>
						👍 Like —
						<span class="font-bold">{{ props.post.countTotalLikes }}</span>
					</button>

					<button
						@click.stop="() => emit('openCommentForm')"
						data-type="secondary"
						class="gap-1"
					>
						💬 Comment —
						<span>{{ props.post.countTotalComments }}</span>
					</button>
				</div>

				<div class="flex gap-3 items-center">
					<button
						v-if="authUser?.id === props.post.authorUser?.authId"
						@click="handleDeletePost"
						data-type="secondary"
						class="gap-1"
					>
						🗑️ Löschen
					</button>
				</div>
			</nav>
		</template>

		<div v-else class="italic">This post has been deleted.</div>
	</article>
</template>

<script lang="ts">
	export type PostProps = {
		post: SelectedPick<PostRecord, ('*' | 'authorUser.*')[]> & {
			currentUser?: { hasLiked?: boolean }
		}
		type: 'detail' | 'feed'
	}
</script>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import type { SelectedPick } from '@xata.io/client'
	import type { PostRecord } from '@/server/lib/xata/gen/client.gen'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	const router = useRouter()
	const authUser = useAuthUser()

	const props = defineProps<{
		post: SelectedPick<PostRecord, ('*' | 'authorUser.*')[]> & {
			currentUser?: { hasLiked?: boolean }
		}
		type: 'detail' | 'feed'
	}>()

	const emit = defineEmits<{
		(e: 'requestRefresh'): void
		(e: 'openCommentForm'): void
	}>()

	const isDeleted = computed(() => !!props.post.isDeleted)

	const isLink = computed(() => {
		return props.type === 'feed'
	})

	const isLikedByCurrUser = computed(() => {
		return !!props.post?.currentUser?.hasLiked
	})

	const handleElementClick = (e: Event) => {
		e.stopPropagation()
		if (isLink.value) {
			router.push(`/p/${props.post.id}`)
		}
	}

	const handlePostLike = async () => {
		const { data, error } = await useFetch('/api/currentUserPostLike', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			body: {
				postId: props.post.id,
				user: {
					id: currentUser.value?.id,
					authId: authUser.value?.id,
				},
			},
		})
		if (error.value || !data.value) return console.error(error)

		return emit('requestRefresh')
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
					id: props.post.id,
				},
			},
		})
		if (error.value || !data.value) return console.error(error)

		return emit('requestRefresh')
	}
</script>
