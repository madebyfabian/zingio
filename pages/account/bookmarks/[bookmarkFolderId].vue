<template>
	<div>
		<div class="mb-8 flex gap-4">
			<button
				@click="navigateTo('/account/bookmarks/folders')"
				data-type="secondary"
			>
				&larr; Back
			</button>
			<h1>
				{{ postBookmarkList?.bookmarkFolder?.icon }}
				{{ postBookmarkList?.bookmarkFolder?.name }}
			</h1>
		</div>

		<PostList
			:posts="postBookmarkList?.posts || null"
			type="feed"
			variant="bookmarks"
			stateKey="accountBookmarksFolderPagePostList"
		/>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute()

	definePageMeta({
		middleware: 'auth',
	})

	const { data: postBookmarkList, pending: postBookmarkListPending } =
		await useFetch('/api/postBookmarkList', {
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			params: { bookmarkFolderId: route.params.bookmarkFolderId },
		})
	if (!postBookmarkList.value)
		throw createError({ statusCode: 404, message: 'Data not found' })

	useHead({
		title: `Bookmarks: ${postBookmarkList.value?.bookmarkFolder?.name}`,
	})
</script>
