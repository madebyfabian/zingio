<template>
	<section
		class="Card"
		:data-size="props.size"
		:data-is-interactive="props.isInteractive"
	>
		<slot />
	</section>
</template>

<script setup lang="ts">
	type Props = {
		size?: 50 | 100
		isInteractive?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		size: 100,
		isInteractive: false,
	})
</script>

<style lang="postcss" scoped>
	.Card {
		@apply bg-white border shadow-sm;

		&[data-size='50'] {
			@apply p-4 rounded-xl;
		}

		&[data-size='100'] {
			@apply p-6 rounded-2xl;
		}

		&[data-is-interactive='true'] {
			@apply transition-shadow cursor-pointer hover:shadow-md;
		}
	}
</style>
