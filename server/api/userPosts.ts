import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
		})
	)

	const userPosts = await xata.db.post
		.select(['*', 'authorUser.*'])
		.filter({
			authorUser: { handle: query.userHandle },
			$notExists: 'isCommentOf',
		})
		.sort('createdAt', 'desc')
		.getMany()

	return userPosts
})
