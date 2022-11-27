<template>
	<div>
		<h3 class="mb-2">Save in bookmark folder</h3>

		<ul
			v-if="
				!bookmarkFoldersPending &&
				!bookmarkPending &&
				Array.isArray(bookmarkFolders)
			"
			class="divide-y divide-gray-200"
		>
			<li>
				<button
					@click.stop="() => handlePostBookmarkSubmit({ toUnsorted: true })"
					class="reset py-4 flex w-full justify-between items-center"
				>
					<span>📬 Unsorted</span>
					<span v-if="isBookmarkedInUnsortedFolder">✅</span>
				</button>
			</li>
			<li v-for="bookmarkFolder of bookmarkFolders" :key="bookmarkFolder.id">
				<button
					@click.stop="
						() =>
							handlePostBookmarkSubmit({
								bookmarkFolderId: bookmarkFolder.id,
							})
					"
					class="reset py-4 flex w-full justify-between items-center"
				>
					<span
						>{{ bookmarkFolder.icon }} {{ bookmarkFolder.name }} ({{
							bookmarkFolder._count_hasBookmarks
						}})</span
					>
					<span
						v-if="isBookmarkedInFolder({ bookmarkFolderId: bookmarkFolder.id })"
						>✅</span
					>
				</button>
			</li>
		</ul>

		<LoadingIndicator layout="fill" v-else />
	</div>
</template>

<script lang="ts">
	export type EmitReturnAction = 'created' | 'deleted' | 'updated' | null
</script>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const authUser = useSupabaseUser()

	const props = defineProps<{
		postId: string
	}>()

	const emit = defineEmits<{
		(e: 'afterSubmit', returnAction: EmitReturnAction): void
	}>()

	const isBookmarkedInUnsortedFolder = computed(() => {
		return bookmark.value && !bookmark.value?.bookmarkFolder?.id
	})

	const isBookmarkedInFolder = ({
		bookmarkFolderId,
	}: {
		bookmarkFolderId?: string
	}) => {
		return (
			bookmarkFolderId &&
			bookmark.value?.bookmarkFolder?.id === bookmarkFolderId
		)
	}

	// Fetch list of all bookmark folders to display as options
	const { data: bookmarkFolders, pending: bookmarkFoldersPending } =
		useLazyFetch('/api/v2/bookmark/folder/list', {
			headers: useRequestHeaders(['cookies']) as Record<string, any>,
		})

	// Fetch single bookmark to check whether the post is already bookmarked.
	const { data: bookmark, pending: bookmarkPending } = useLazyFetch(
		'/api/v2/bookmark/details',
		{
			headers: useRequestHeaders(['cookies']) as Record<string, any>,
			params: {
				postId: props.postId,
				bookmarkUserAuthId: authUser.value?.id,
			},
		}
	)

	const handlePostBookmarkSubmit = async ({
		bookmarkFolderId,
		toUnsorted = false,
	}: {
		bookmarkFolderId?: string
		toUnsorted?: boolean
	}) => {
		let returnAction: EmitReturnAction = null

		const willDelete =
			(toUnsorted && isBookmarkedInUnsortedFolder.value) ||
			(bookmarkFolderId && isBookmarkedInFolder({ bookmarkFolderId }))

		// If user clicks same folder, then we want to delete it
		if (willDelete) {
			const { data, error } = await useFetch('/api/v2/bookmark/remove', {
				method: 'POST',
				headers: useRequestHeaders(['cookies']) as Record<string, any>,
				body: JSON.stringify({
					bookmark: {
						user: {
							authId: authUser.value?.id,
						},
						id: bookmark.value?.id,
					},
				}),
			})
			if (!data.value || error.value) {
				console.error(error.value)
			} else {
				returnAction = 'deleted'
			}
		} else {
			const { data, error } = await useFetch('/api/v2/bookmark/addOrUpdate', {
				method: 'POST',
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookies']),
				body: {
					bookmark: {
						user: {
							authId: authUser.value?.id,
						},
						id: bookmark.value?.id ?? undefined,
						post: {
							id: props.postId,
						},
						bookmarkFolder: bookmarkFolderId
							? {
									id: bookmarkFolderId,
							  }
							: undefined,
					},
				},
			})
			if (!data.value || error.value) {
				console.error(error.value)
			} else {
				returnAction = bookmark.value?.id ? 'updated' : 'created'
			}
		}

		emit('afterSubmit', returnAction)
	}
</script>
