import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			postId: z.string(),
		})
	)

	const [post, postLikes, postComments] = await Promise.all([
		// post
		xata.db.post
			.select(['*', 'authorUser.*', 'isCommentOf.*'])
			.filter({ id: query.postId })
			.getFirstOrThrow(),

		// postLikes
		xata.db.postLikes
			.select(['id', 'user.authId'])
			.filter({ post: { id: query.postId } })
			.getMany(),

		// postComments
		xata.db.post
			.select(['*', 'authorUser.*'])
			.filter({ isCommentOf: { id: query.postId } })
			.sort('createdAt', 'desc')
			.getMany(),
	])

	// Aggregate.
	const postLikesCount = await xata.db.postLikes.summarize({
		columns: ['post.*'],
		summaries: {
			total_likes: { sum: '_counter' },
		},
		filter: { post: { id: query.postId } },
	})

	console.log(postLikesCount)

	return {
		post,
		postLikes,
		postComments,
	}
})
