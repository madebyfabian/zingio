<template>
	<article
		:tabindex="!state.editMode ? 0 : undefined"
		:role="!state.editMode ? 'link' : undefined"
		@click="handleElementClick"
		@keydown.enter="handleElementClick"
		class="block border border-gray-200 rounded-xl p-4"
		:class="{
			'cursor-pointer hover:shadow-md transition-shadow': !state.editMode,
		}"
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
	</article>
</template>

<script lang="ts">
	export type BookmarkFolderItem = Omit<
		SelectedPick<BookmarkFolderRecord, ('*' | 'user.id' | 'user.authId')[]>,
		| 'delete'
		| 'getMetadata'
		| 'read'
		| 'update'
		| 'replace'
		| 'updatedAt'
		| 'createdAt'
	>
</script>

<script setup lang="ts">
	import type { BookmarkFolderRecord } from '@/server/lib/xata/gen/client.gen'
	import type { SelectedPick } from '@xata.io/client'

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
