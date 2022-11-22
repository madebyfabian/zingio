<template>
	<div class="py-8 h-full" :class="{ 'border-r': !props.asMenu }">
		<NuxtLink
			v-if="!props.asMenu"
			class="font-black text-3xl tracking-tight text-gray-700 inline-block"
			to="/"
		>
			<span class="text-2xl">💬</span> timmo<span class="opacity-50">.</span>
		</NuxtLink>

		<hr class="my-8" />

		<ul class="flex flex-col">
			<SidebarItem to="/" icon="🏡">Home</SidebarItem>
			<SidebarItem to="/account/bookmarks/folders" icon="🔖"
				>Bookmarks</SidebarItem
			>
			<SidebarItem to="/discover/users" icon="🕵️">Discover People</SidebarItem>
		</ul>

		<hr class="my-8" />

		<h3 v-if="currentUser" class="mb-2">Hi, {{ currentUser.name }} 👋</h3>

		<ul class="flex flex-col">
			<template v-if="currentUser">
				<SidebarItem :to="`/@${currentUser.handle}`" icon="🙋"
					>My Profile
				</SidebarItem>
				<SidebarItem to="/account/settings" icon="⚙️">Settings</SidebarItem>
				<SidebarItem to="/auth/signout" icon="🚪">Sign out</SidebarItem>
			</template>

			<template v-else>
				<SidebarItem to="/auth/signin" icon="🔑">Login</SidebarItem>
				<SidebarItem to="/auth/signup" icon="📝">Signup</SidebarItem>
			</template>
		</ul>

		<hr class="my-8" />

		<div class="pr-6">
			<PostCreateDialog />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)

	const props = defineProps<{
		asMenu?: boolean
	}>()
</script>
