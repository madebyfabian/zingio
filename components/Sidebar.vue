<template>
	<div class="py-8 h-full border-r border-gray-200">
		<NuxtLink
			class="font-black text-3xl tracking-tight text-emerald-600 inline-block"
			to="/"
		>
			timmo<span class="opacity-50">.</span>
		</NuxtLink>

		<hr class="my-8" />

		<ul class="flex flex-col">
			<SidebarItem to="/" icon="🏡">Home</SidebarItem>
		</ul>

		<hr class="my-8" />

		<h3 v-if="currentUser" class="mb-2">Hi, {{ currentUser.name }}👋</h3>

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
			<button class="w-full" @click="$router.push('/p/create')">
				💬 Create something!
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useCurrentUserStore } from '@/stores/useCurrentUserStore'
	const currentUserStore = useCurrentUserStore()
	const currentUser = computed(() => currentUserStore.currentUser)
</script>
