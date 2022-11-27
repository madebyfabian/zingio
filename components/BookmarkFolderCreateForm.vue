<template>
	<BookmarkFolderItem
		:bookmarkFolder="(state as any)"
		:editMode="true"
		@submit="handleSubmit"
	/>
</template>

<script setup lang="ts">
	const authUser = useSupabaseUser()

	const emit = defineEmits<{
		(e: 'requestRefresh'): void
	}>()

	/** @todo add correct types (also see "as any" in template) */
	const state = reactive({
		name: 'New Folder',
		icon: '📚',
		user: {
			authId: authUser.value?.id,
		},
	})

	const handleSubmit = async () => {
		const { data, error } = await useFetch(
			'/api/v2/bookmark/folder/createOrUpdate',
			{
				method: 'POST',
				// @ts-expect-error - this is a valid option
				headers: useRequestHeaders(['cookies']),
				body: {
					bookmarkFolder: state,
				},
			}
		)
		if (error.value || !data.value) {
			return console.error(error.value)
		}
		emit('requestRefresh')
	}
</script>
