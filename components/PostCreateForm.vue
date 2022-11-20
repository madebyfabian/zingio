<template>
	<form @submit.prevent="() => emit('submit', postState)">
		<div class="flex justify-between items-center">
			<h1>Create</h1>
			<div class="flex gap-3 items-center">
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
		</div>

		<textarea
			v-model="postState.content"
			rows="5"
			class="mt-4 w-full"
		></textarea>
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
