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
			class="flex gap-4 items-center mt-4 text-sm empty:hidden"
		>
			<button
				:data-type="isLikedByCurrUser ? 'secondary' : 'primary'"
				@click="handlePostLike"
			>
				Like
				<span>{{ props.postLikes?.length }}</span>
			</button>

			<div v-if="props.postCommentsCount !== undefined">
				Comment
				<span>{{ props.postCommentsCount }}</span>
			</div>
		</div>

		<pre v-if="props.type === 'detail'" class="mt-4">{{ post }}</pre>
	</article>
</template>

<script setup lang="ts">
	import type { Post, PostLikes } from '@/server/lib/xata/gen/client.gen'
	const router = useRouter()
	const authUser = useAuthUser()

	const props = defineProps<{
		post: Partial<Post>
		postLikes?: Partial<PostLikes>[]
		postCommentsCount?: number
		type: 'feed' | 'detail'
	}>()

	const isLink = computed(() => {
		return props.type === 'feed'
	})

	const isLikedByCurrUser = computed(() => {
		if (!props.postLikes?.length) return false

		return !!props.postLikes.find(postLike => {
			return postLike.authorUser?.authId === authUser.value?.id
		})
	})

	const handleElementClick = () => {
		if (isLink.value) {
			router.push(`/p/${props.post.id}`)
		}
	}

	const handlePostLike = () => {
		// TBD.
	}
</script>
