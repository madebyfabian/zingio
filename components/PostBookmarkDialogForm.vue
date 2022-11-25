<template>
	<div>
		<h3 class="mb-2">Save in bookmark folder</h3>

		<ul
			v-if="
				!bookmarkFoldersPending &&
				!postBookmarkPending &&
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
	const currentUser = computed(() => currentUserStore.currentUser)
	const authUser = useSupabaseUser()

	const props = defineProps<{
		postId: string
	}>()

	const emit = defineEmits<{
		(e: 'afterSubmit', returnAction: EmitReturnAction): void
	}>()

	const isBookmarkedInUnsortedFolder = computed(() => {
		return postBookmark.value && !postBookmark.value?.bookmarkFolder?.id
	})

	const isBookmarkedInFolder = ({
		bookmarkFolderId,
	}: {
		bookmarkFolderId?: string
	}) => {
		return (
			bookmarkFolderId &&
			postBookmark.value?.bookmarkFolder?.id === bookmarkFolderId
		)
	}

	const { data: bookmarkFolders, pending: bookmarkFoldersPending } =
		useLazyFetch('/api/v2/bookmark/folder/list', {
			headers: useRequestHeaders(['cookies']) as Record<string, any>,
		})

	const { data: postBookmark, pending: postBookmarkPending } = useLazyFetch(
		'/api/postBookmark',
		{
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookies']),
			params: {
				postId: props.postId,
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
			const { data, error } = await useFetch('/api/postBookmarkDelete', {
				method: 'POST',
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookies']),
				body: JSON.stringify({
					postBookmark: {
						user: {
							id: currentUser.value?.id,
							authId: authUser.value?.id,
						},
						id: postBookmark.value?.id,
					},
				}),
			})
			if (!data.value || error.value) {
				console.error(error.value)
			} else {
				returnAction = 'deleted'
			}
		} else {
			const { data, error } = await useFetch('/api/postBookmark', {
				method: 'POST',
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookies']),
				body: {
					postBookmark: {
						user: {
							id: currentUser.value?.id,
							authId: authUser.value?.id,
						},
						id: postBookmark.value?.id ?? undefined,
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
				returnAction = postBookmark.value?.id ? 'updated' : 'created'
			}
		}

		emit('afterSubmit', returnAction)
	}
</script>
