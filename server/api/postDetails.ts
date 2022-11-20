import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'
import { getPostList } from '@/server/utils/getPostList'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			postId: z.string(),
		})
	)

	// Get raw data.
	const [postsRaw, postCommentsRaw] = await Promise.all([
		// postRaw
		xata.db.post
			.select(['*', 'authorUser.*', 'isCommentOf.*'])
			.filter({ id: query.postId })
			.getMany(),

		// postCommentsRaw
		xata.db.post
			.select(['*', 'authorUser.*'])
			.filter({ isCommentOf: { id: query.postId } })
			.sort('createdAt', 'desc')
			.getMany(),
	])

	const [posts, postComments] = await Promise.all([
		// post
		getPostList<typeof postsRaw>({
			event,
			posts: postsRaw,
		}),

		// postComments
		getPostList<typeof postCommentsRaw>({
			event,
			posts: postCommentsRaw,
		}),
	])

	return {
		posts,
		postComments,
	}
})
