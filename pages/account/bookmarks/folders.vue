<template>
	<div>
		<div class="flex items-center justify-between">
			<h1>Your bookmark folders</h1>
			<button @click="state.createFormVisible = true">Add new</button>
		</div>

		<div
			class="grid lg:grid-cols-3 gap-8 mt-8"
			v-if="Array.isArray(bookmarkFolders)"
		>
			<BookmarkFolderItem
				:bookmarkFolder="({ name: 'Unsorted', icon: '📬', id: 'unsorted' } as any)"
				isReadOnly
			/>

			<BookmarkFolderCreateForm
				v-if="state.createFormVisible"
				@requestRefetch="refreshBookmarkFolders"
			/>

			<BookmarkFolderItem
				v-for="bookmarkFolder of bookmarkFolders"
				:key="bookmarkFolder.id"
				:bookmarkFolder="bookmarkFolder"
				@submit="handleBookmarkFolderUpdate"
				@delete="handleBookmarkFolderDelete"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { BookmarkFolderItem } from '@/components/BookmarkFolderItem.vue'

	definePageMeta({
		middleware: 'auth',
	})

	useHead({
		title: `Bookmark folders`,
	})

	const { data: bookmarkFolders, refresh: refreshBookmarkFolders } =
		await useFetch('/api/v2/bookmark/folder/list', {
			headers: useRequestHeaders(['cookie']) as Record<string, any>,
		})

	const state = reactive({
		createFormVisible: false,
	})

	const handleBookmarkFolderUpdate = async (value: BookmarkFolderItem) => {
		const { data, error } = await useFetch(
			'/api/v2/bookmark/folder/createOrUpdate',
			{
				method: 'POST',
				headers: useRequestHeaders(['cookies']) as Record<string, any>,
				body: {
					bookmarkFolder: {
						id: value.id,
						name: value.name,
						icon: value.icon,
						user: {
							authId: value.user?.authId,
						},
					},
				},
			}
		)
		if (error.value || !data.value) {
			return console.error(error.value)
		}
		refreshBookmarkFolders()
	}

	const handleBookmarkFolderDelete = async (value: BookmarkFolderItem) => {
		const { data, error } = await useFetch('/api/v2/bookmark/folder/delete', {
			method: 'POST',
			headers: useRequestHeaders(['cookies']) as Record<string, any>,
			body: {
				bookmarkFolder: {
					id: value.id,
					user: {
						authId: value.user?.authId,
					},
				},
			},
		})
		if (error.value || !data.value) {
			return console.error(error.value)
		}
		refreshBookmarkFolders()
	}
</script>
