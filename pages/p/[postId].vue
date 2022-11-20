<template>
	<div>
		<Post
			v-if="data?.post && data?.postLikes"
			:post="data.post"
			:postLikes="data.postLikes"
			:postCommentsCount="data.postComments?.length"
			type="detail"
		/>

		<hr />

		<section v-if="data?.postComments" class="ml-6">
			<Post
				v-for="postComment of data.postComments"
				:key="postComment.id"
				:post="postComment"
				type="feed"
			/>
		</section>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute()

	// Fetch `userDetails`
	const { data } = await useFetch('/api/postDetails', {
		params: {
			postId: route.params.postId,
		},
	})
	if (!data.value) {
		throw createError({ statusCode: 404 })
	}
</script>
