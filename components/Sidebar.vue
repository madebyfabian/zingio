<template>
	<div
		class="Sidebar py-8 h-full max-h-screen lg:w-[inherit]"
		:class="{ 'border-r fixed': !props.asMenu }"
	>
		<Logo v-if="!props.asMenu" />

		<hr class="my-8" />

		<ul class="flex flex-col">
			<SidebarItem to="/" icon="๐ก">Home</SidebarItem>

			<SidebarItem to="/discover/users" icon="๐ต๏ธ">Discover People</SidebarItem>
		</ul>

		<hr class="my-8" />

		<h3 v-if="currentUser" class="mb-2">Hi, {{ currentUser.name }} ๐</h3>

		<ul class="flex flex-col">
			<template v-if="currentUser">
				<SidebarItem to="/account/bookmarks/folders" icon="๐"
					>Bookmarks</SidebarItem
				>
				<SidebarItem :to="`/@${currentUser.handle}`" icon="๐"
					>My Profile
				</SidebarItem>
				<SidebarItem to="/account/settings" icon="โ๏ธ">Settings</SidebarItem>
				<SidebarItem @click="handleSignout" icon="๐ช">Sign out</SidebarItem>
			</template>

			<template v-else>
				<SidebarItem to="/auth/signin" icon="๐">Login</SidebarItem>
				<SidebarItem to="/auth/signup" icon="๐">Signup</SidebarItem>
			</template>
		</ul>

		<hr class="my-8" />

		<div class="pr-6">
			<PostCreateDialog />
		</div>

		<div class="mt-8 text-xs flex">
			<a
				href="https://github.com/madebyfabian/zingio"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub</a
			>

			<span class="mx-1 text-gray-500">ยท</span>

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

			<span class="mx-1 text-gray-500">ยท</span>

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
	const supabaseAuth = useSupabaseAuthClient()

	const props = defineProps<{
		asMenu?: boolean
	}>()

	const handleSignout = async () => {
		const { error } = await supabaseAuth.auth.signOut()
		if (error) console.error(error)
	}
</script>
