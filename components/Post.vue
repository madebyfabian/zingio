<template>
	<article
		:tabindex="isLink ? 0 : undefined"
		:role="isLink ? 'link' : undefined"
		@click.capture="handleElementClick"
		@keydown.capture.enter="handleElementClick"
		class="Post block py-4 bg-gray-100 rounded-xl p-6 my-6"
		:class="{
			'cursor-pointer': isLink,
		}"
	>
		<UserLink v-if="props.post.authorUser" :user="props.post.authorUser" />

		<p class="mt-4" :class="{ 'text-xl': props.type === 'detail' }">
			{{ props.post.content }}
		</p>

		<div
			v-if="props.type === 'detail'"
			class="flex gap-3 items-center mt-4 text-sm empty:hidden"
		>
			<button
				@click="handlePostLike"
				:data-type="isLikedByCurrUser ? 'secondary' : 'primary'"
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

		<pre v-if="props.type === 'detail'" class="mt-4">{{ post }}</pre>
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
		(e: 'openCommentForm'): void
	}>()

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

	const handlePostComment = () => {}
</script>
