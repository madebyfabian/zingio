import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'
import type { PostRecord } from '@/server/lib/xata/gen/client.gen'
import { PostExtension } from '@/types'

export const getPostList = async <R extends { id: PostRecord['id'] }[]>({
	posts,
	event,
}: {
	posts: R
	event: H3Event
}) => {
	const serverAuthUser = await serverSupabaseUser(event)

	// If user logged in, get list of posts they've liked
	const currentUserLikes =
		!posts.length || !serverAuthUser
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
		const returnObj: R[0] & PostExtension = {
			...post,
			currentUser: {
				hasLiked: !serverAuthUser ? undefined : !!postLike,
			},
		}
		return returnObj
	})
}
