<template>
	<div
		class="Sidebar py-8 h-full max-h-screen lg:w-[inherit]"
		:class="{ 'border-r fixed': !props.asMenu }"
	>
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

		<div class="mt-8 text-xs flex">
			<a
				href="https://github.com/madebyfabian/twitter-clone"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub</a
			>

			<span class="mx-1 text-gray-500">·</span>

			<a
				href="https://twitter.com/madebyfabian"
				target="_blank"
				rel="noopener noreferrer"
				>By @madebyfabian
			</a>
		</div>

		<div class="mt-1 mb-8 text-xs flex">
			<a
				href="https://madebyfabian.com/impressum/"
				target="_blank"
				rel="noopener noreferrer"
				>Legal Notice
			</a>

			<span class="mx-1 text-gray-500">·</span>

			<a
				href="https://madebyfabian.com/datenschutz/"
				target="_blank"
				rel="noopener noreferrer"
				>Privacy
			</a>
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
