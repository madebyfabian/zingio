<template>
	<li>
		<NuxtLink v-if="props.to" class="py-2.5 flex gap-2" :to="props.to">
			<span>{{ props.icon }}</span>
			<span class="SidebarItem-text"><slot /></span>
		</NuxtLink>

		<button v-else v-bind="$attrs" class="reset py-2.5 flex gap-2">
			<span>{{ props.icon }}</span>
			<span class="SidebarItem-text"><slot /></span>
		</button>
	</li>
</template>

<script setup lang="ts">
	const props = defineProps<{
		icon: string
		to?: string
	}>()
</script>

<style lang="postcss" scoped>
	a.router-link-exact-active .SidebarItem-text {
		@apply underline underline-offset-2 decoration-cyan-300;
	}
</style>
