<template>
	<li>
		<NuxtLink class="py-2.5 flex gap-2" :to="props.to">
			<span>{{ props.icon }}</span>
			<span class="SidebarItem-text"><slot /></span>
		</NuxtLink>
	</li>
</template>

<script setup lang="ts">
	const props = defineProps<{
		icon: string
		to: string
	}>()
</script>

<style lang="postcss" scoped>
	a.router-link-exact-active .SidebarItem-text {
		@apply underline underline-offset-2 decoration-cyan-300;
	}
</style>
