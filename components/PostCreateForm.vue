<template>
	<form @submit.prevent="() => emit('submit', postState)">
		<textarea
			v-model="postState.content"
			placeholder="What's on your mind?"
			rows="5"
			class="w-full"
		></textarea>

		<div class="flex gap-3 mt-4 items-center justify-end">
			<button
				v-if="props.hasCancelOption"
				@click="() => emit('cancel')"
				type="button"
				data-type="secondary"
			>
				Cancel
			</button>

			<button type="submit">🪶 Post</button>
		</div>
	</form>
</template>

<script lang="ts">
	export type PostState = {
		content: string
	}

	export default {}
</script>

<script setup lang="ts">
	const postState = reactive<PostState>({
		content: '',
	})

	const props = defineProps({
		hasCancelOption: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits<{
		(e: 'submit', postState: PostState): void
		(e: 'cancel'): void
	}>()
</script>
