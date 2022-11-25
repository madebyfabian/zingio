<template>
	<Card
		:tabindex="!state.editMode ? 0 : undefined"
		:role="!state.editMode ? 'link' : undefined"
		@click="handleElementClick"
		@keydown.enter="handleElementClick"
		:isInteractive="!state.editMode"
	>
		<form @submit.prevent="handleSubmit">
			<div class="flex justify-between">
				<div>
					<div v-if="!state.editMode" class="text-5xl">
						{{ bookmarkFolder.icon }}
					</div>
					<input
						v-else
						class="reset w-full text-5xl h-12 translate-y-0.5"
						v-model="props.bookmarkFolder.icon"
						minlength="1"
						type="text"
					/>
				</div>

				<template v-if="!props.isReadOnly">
					<div v-if="!state.editMode" class="flex gap-2 items-start">
						<button
							type="button"
							data-type="secondary"
							@click.stop="state.editMode = true"
						>
							✏️
						</button>

						<button
							type="button"
							data-type="secondary"
							@click.stop="handleDelete"
						>
							🗑️
						</button>
					</div>
					<button v-else>Save</button>
				</template>
			</div>

			<div class="mt-4">
				<div v-if="!state.editMode" class="font-bold text-lg">
					{{ bookmarkFolder.name }}
					{{
						typeof bookmarkFolder._count_hasBookmarks === 'number'
							? `(${bookmarkFolder._count_hasBookmarks})`
							: null
					}}
				</div>
				<input
					v-else
					autofocus
					class="reset w-full font-bold text-lg"
					v-model="props.bookmarkFolder.name"
					type="text"
					placeholder="New Name"
				/>
			</div>
		</form>
	</Card>
</template>

<script lang="ts">
	export type BookmarkFolderItem = BookmarkFolderListItem
</script>

<script setup lang="ts">
	import type { BookmarkFolderListItem } from '@/server/api/v2/bookmark/folder/list'

	const state = reactive({
		editMode: false,
	})

	const props = defineProps<{
		bookmarkFolder: BookmarkFolderItem
		editMode?: boolean
		isReadOnly?: boolean
	}>()

	watch(
		() => props.editMode,
		value => {
			state.editMode = Boolean(value)
		},
		{
			immediate: true,
		}
	)

	const emit = defineEmits<{
		(e: 'submit', value: BookmarkFolderItem): void
		(e: 'delete', value: BookmarkFolderItem): void
	}>()

	const handleElementClick = () => {
		if (!state.editMode)
			navigateTo(`/account/bookmarks/${props.bookmarkFolder.id}`)
	}

	const handleSubmit = () => {
		if (state.editMode) {
			emit('submit', props.bookmarkFolder)
			state.editMode = false
		}
	}

	const handleDelete = () => {
		emit('delete', props.bookmarkFolder)
	}
</script>
