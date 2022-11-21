<template>
	<BookmarkFolderItem
		:bookmarkFolder="state"
		:editMode="true"
		@submit="handleSubmit"
	/>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
	const authUser = useAuthUser()

	const emit = defineEmits<{
		(e: 'requestRefresh'): void
	}>()

	const state = reactive({
		id: '',
		name: 'New Folder',
		icon: '📚',
		user: {
			id: currentUser.value?.id,
			authId: authUser.value?.id,
		},
	})

	const handleSubmit = async () => {
		const { data, error } = await useFetch('/api/bookmarkFolders', {
			method: 'POST',
			// @ts-expect-error - this is a valid option
			headers: useRequestHeaders(['cookies']),
			body: {
				bookmarkFolder: state,
			},
		})
		if (error.value || !data.value) {
			return console.error(error.value)
		}
		emit('requestRefresh')
	}
</script>
