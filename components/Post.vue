<template>
	<article
		:tabindex="isLink ? 0 : undefined"
		:role="isLink ? 'link' : undefined"
		@click.capture="handleElementClick"
		@keydown.capture.enter="handleElementClick"
		class="Post block bg-white border border-gray-200 rounded-xl p-6 mb-6"
		:class="{
			'cursor-pointer': isLink,
			'shadow-lg': !isLink,
		}"
	>
		<template v-if="!isDeleted">
			<UserLink v-if="props.post.authorUser" :user="props.post.authorUser" />

			<p class="mt-4" :class="{ 'text-xl': props.type === 'detail' }">
				{{ props.post.content }}
			</p>

			<nav v-if="props.type === 'detail'" class="flex justify-between mt-4">
				<div class="flex gap-3 items-center">
					<button
						@click="handlePostLike"
						:data-type="isLikedByCurrUser ? 'primary' : 'secondary'"
						class="gap-1"
					>
						👍 Like —
						<span class="font-bold">{{ props.postLikes?.length }}</span>
					</button>

					<button
						@click="() => emit('openCommentForm')"
						data-type="secondary"
						class="gap-1"
					>
						💬 Comment —
						<span>{{ props.postCommentsCount }}</span>
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

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	import type { Post, PostLikes } from '@/server/lib/xata/gen/client.gen'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	const router = useRouter()
	const authUser = useAuthUser()

	const props = defineProps<{
		post: Partial<Post>
		postLikes?: Partial<PostLikes>[]
		postCommentsCount?: number
		type: 'feed' | 'detail'
	}>()

	const emit = defineEmits<{
		(e: 'like'): void
		(e: 'requestRefresh'): void
		(e: 'openCommentForm'): void
	}>()

	const isDeleted = computed(() => !!props.post.isDeleted)

	const isLink = computed(() => {
		return props.type === 'feed'
	})

	const isLikedByCurrUser = computed(() => {
		if (!props.postLikes?.length) return false

		return !!props.postLikes.find(postLike => {
			return postLike.user?.authId === authUser.value?.id
		})
	})

	const handleElementClick = () => {
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

		return emit('like')
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
