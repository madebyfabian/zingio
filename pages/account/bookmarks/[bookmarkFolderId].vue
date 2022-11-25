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
				{{ bookmarkFolderDetails?.icon }}
				{{ bookmarkFolderDetails?.name }}
			</h1>
		</div>

		<pre>{{ postList }}</pre>

		<PostList
			:posts="postList"
			type="feed"
			variant="bookmarks"
			stateKey="accountBookmarksFolderPagePostList"
		/>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute()
	const authUser = useSupabaseUser()

	definePageMeta({
		middleware: 'auth',
	})

	const { data: bookmarkFolderDetails } = await useFetch(
		'/api/v2/bookmark/folder/details',
		{
			headers: useRequestHeaders(['cookie']) as Record<string, any>,
			params: {
				bookmarkFolderId: route.params.bookmarkFolderId,
				bookmarkFolderUserAuthId: authUser.value?.id,
			},
		}
	)
	if (!bookmarkFolderDetails.value)
		throw createError({ statusCode: 404, message: 'Data not found' })

	useHead({
		title: `Bookmarks: ${bookmarkFolderDetails.value?.name}`,
	})

	const postList = computed(() => {
		return (
			bookmarkFolderDetails.value?.hasBookmarks.map(
				bookmark => bookmark.post
			) || null
		)
	})
</script>
