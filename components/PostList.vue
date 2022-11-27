<template>
	<div v-if="!pending">
		<div v-if="posts?.length">
			<Post
				v-for="post of posts"
				:key="post.id"
				:post="post"
				:type="_props.type"
				@postDeleted="handlePostDeleted"
				@bookmarkChanged="handlePostBookmarkChanged"
				@openCommentForm="handleOpenCommentForm"
			/>
		</div>
		<div v-else class="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
			No posts here yet 👀.
		</div>
	</div>
	<LoadingIndicator v-else layout="fill" />
</template>

<script setup lang="ts">
	import type { PostProps } from '@/components/Post.vue'
	import type { EmitReturnAction } from '@/components/PostBookmarkDialogForm.vue'
	const route = useRoute()

	const _props = withDefaults(
		defineProps<{
			posts: PostProps['post'][] | null
			pending?: boolean
			type: PostProps['type']
			variant?: 'default' | 'bookmarks'
			stateKey: string
		}>(),
		{
			variant: 'default',
		}
	)

	onMounted(() => {
		if (route.query.openCommentForm === 'true') emit('openCommentForm')
	})

	const hiddenPostIds = useState<string[]>(
		`hiddenPostIds:${_props.stateKey}`,
		() => []
	)
	const _posts = useState(_props.stateKey, () => _props.posts)
	watchEffect(() => {
		_posts.value = _props.posts
	})

	const posts = computed(() => {
		if (_posts.value === null) return null
		return _props.posts?.filter(post => !hiddenPostIds.value.includes(post.id))
	})

	const emit = defineEmits<{
		(e: 'openCommentForm'): void
	}>()

	const addToHiddenPostIds = (id: string) => {
		if (!hiddenPostIds.value.includes(id)) hiddenPostIds.value.push(id)
	}

	const handlePostDeleted = (postId: string) => {
		addToHiddenPostIds(postId)
	}

	const handleOpenCommentForm = () => {
		if (_props.type === 'feed') {
			navigateTo(`/p/${posts.value?.[0].id}?openCommentForm=true`)
		}

		if (_props.type === 'detail') {
			emit('openCommentForm')
		}
	}

	const handlePostBookmarkChanged = (
		postId: string,
		returnAction: EmitReturnAction
	) => {
		switch (returnAction) {
			case 'deleted':
				_props.variant === 'bookmarks' && addToHiddenPostIds(postId)
				break

			case 'updated':
				// If this PostList is used for bookmarks and we update a bookmark, this means it's no longer in the list.
				_props.variant === 'bookmarks' && addToHiddenPostIds(postId)
				break

			case 'created':
				break
		}
	}
</script>
