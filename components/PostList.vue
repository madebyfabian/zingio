<template>
	<div v-if="props.posts?.length">
		<Post
			v-for="post of props.posts"
			:key="post.id"
			:post="post"
			:type="props.type"
			@requestRefresh="emit('requestRefresh')"
			@openCommentForm="handleOpenCommentForm"
		/>
	</div>
	<div v-else class="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
		No posts here yet 👀.
	</div>
</template>

<script setup lang="ts">
	import { PostProps } from '@/components/Post.vue'
	const route = useRoute()

	const props = defineProps<{
		posts: PostProps['post'][] | null
		type: PostProps['type']
	}>()

	const emit = defineEmits<{
		(e: 'requestRefresh'): void
		(e: 'openCommentForm'): void
	}>()

	const handleOpenCommentForm = () => {
		if (props.type === 'feed') {
			navigateTo(`/p/${props.posts?.[0].id}?openCommentForm=true`)
		}

		if (props.type === 'detail') {
			emit('openCommentForm')
		}
	}

	onMounted(() => {
		if (route.query.openCommentForm === 'true') emit('openCommentForm')
	})
</script>
