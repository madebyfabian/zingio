import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'
import { getPostList } from '@/server/utils/getPostList'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
		})
	)

	const userPostsRaw = await xata.db.post
		.select(['*', 'authorUser.*'])
		.filter({
			authorUser: { handle: query.userHandle },
			isDeleted: false,
			$notExists: 'isCommentOf',
		})
		.sort('createdAt', 'desc')
		.getMany()

	return await getPostList<typeof userPostsRaw>({
		event,
		posts: userPostsRaw,
	})
})
