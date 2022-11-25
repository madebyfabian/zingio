<template>
	<div>
		<h1 class="mb-8">🕵️ Discover People</h1>

		<div v-if="userDetailsList" class="flex flex-col gap-4">
			<Card
				v-for="userDetails of userDetailsList"
				:key="userDetails.id"
				class="flex justify-between items-center"
			>
				<UserLink :user="userDetails" />
				<UserFollowButton :user="userDetails" />
			</Card>
		</div>
	</div>
</template>

<script lang="ts">
	export default defineComponent({
		async setup() {
			useHead({
				title: `Discover People`,
			})

			const { data: userDetailsList } = await useFetch('/api/userDetailsList', {
				headers: useRequestHeaders(['cookie']) as Record<string, any>,
			})

			return { userDetailsList }
		},
	})
</script>
