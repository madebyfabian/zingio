<template>
	<div>
		<div class="mb-8 flex gap-4">
			<button
				@click="navigateTo('/account/bookmarks/folders')"
				data-type="secondary"
			>
				&larr; Back
			</button>
			<h1>📬 Unsorted</h1>
		</div>

		<PostList
			v-if="postBookmarkList?.posts"
			:posts="postBookmarkList.posts"
			type="feed"
			variant="bookmarks"
			stateKey="accountBookmarksUnsortedPagePostList"
		/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: 'auth',
	})

	useHead({
		title: `Bookmarks: Unsorted`,
	})

	const { data: postBookmarkList, refresh: refreshPostBookmarkList } =
		await useFetch('/api/postBookmarkList', {
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookie']),
			params: { onlyUnsorted: true },
		})
	if (!postBookmarkList.value)
		throw createError({ statusCode: 404, message: 'Data not found' })
</script>
