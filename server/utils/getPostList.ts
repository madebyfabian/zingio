import type { H3Event } from 'h3'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'
import type { PostRecord } from '@/server/lib/xata/gen/client.gen'

export const getPostList = async <R extends { id: PostRecord['id'] }[]>({
	posts,
	event,
}: {
	posts: R
	event: H3Event
}) => {
	const serverAuthUser = await useServerAuthUser(event)

	// If not authenticated, return bare posts.
	if (!serverAuthUser) return posts

	const currentUserLikes = !posts.length
		? []
		: await xata.db.postLikes
				.select(['id', 'user.authId', 'post.id', 'post.createdAt'])
				.filter({
					user: { authId: serverAuthUser.id },
					post: {
						id: { $any: posts.map(post => post.id) },
					},
				})
				.sort('post.createdAt', 'desc')
				.getMany()

	return posts.map(post => {
		const postLike = currentUserLikes.find(
			postLike => postLike.post?.id === post.id
		)
		return {
			...post,
			currentUser: {
				hasLiked: !!postLike,
			},
		} as R[0] & { currentUser: { hasLiked: boolean } }
	})
}
