<template>
	<div class="py-6 h-full border-r border-gray-200">
		<ul class="flex flex-col gap-4">
			<li>
				<NuxtLink to="/">🏡 Home</NuxtLink>
			</li>
		</ul>

		<hr class="my-8" />

		<ul class="flex flex-col gap-4">
			<template v-if="authUser">
				<li>
					<NuxtLink to="/todo"> 🙋 Hi, User </NuxtLink>
				</li>
				<li>
					<NuxtLink :to="`/account/settings`"> ⚙️ Settings </NuxtLink>
				</li>
				<li>
					<NuxtLink to="/auth/signout">🔓 Sign out</NuxtLink>
				</li>
			</template>

			<template v-else>
				<li>
					<NuxtLink to="/auth/signin">🔑 Login</NuxtLink>
				</li>

				<li>
					<NuxtLink to="/auth/signup">📝 Signup</NuxtLink>
				</li>
			</template>
		</ul>

		<hr class="my-8" />

		<div class="pr-6">
			<button class="w-full" @click="$router.push('/create')">
				💬 Create something!
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const authUser = useAuthUser()
</script>

<style scoped lang="postcss">
	a {
		@apply border-b-2 border-blue-300;
	}
</style>
