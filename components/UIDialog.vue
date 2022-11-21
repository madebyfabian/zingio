<template>
	<dialog ref="dialogEl" @close="handleClose">
		<div class="absolute right-4 top-5">
			<button @click="handleClose" type="button" data-type="secondary">
				X
			</button>
		</div>

		<div>
			<slot />
		</div>
	</dialog>
</template>

<script setup lang="ts">
	type Props = {
		isOpen: boolean
	}
	const props = defineProps<Props>()
	const emit = defineEmits(['close'])
	const dialogEl = ref<null | HTMLDialogElement>(null)

	const handleClose = () => {
		dialogEl.value?.close()
		emit('close')
	}

	watchEffect(() => {
		if (props.isOpen) dialogEl.value?.showModal()
		else handleClose()
	})
</script>

<style lang="postcss">
	dialog {
		@apply rounded-2xl p-8 font-normal overflow-x-hidden overflow-y-auto bg-gray-50 w-[480px] max-w-full;

		&::backdrop {
			@apply bg-gray-900/75;
		}
	}
</style>
