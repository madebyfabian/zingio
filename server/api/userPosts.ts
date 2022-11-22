import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'
import { getPostList } from '@/server/utils/getPostList'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
			paginationCursor: z.string().optional(),
		})
	)

	const userPostsPaginatedRaw = await xata.db.post
		.select(['*', 'authorUser.*'])
		.filter({
			authorUser: { handle: query.userHandle },
			isDeleted: false,
			$notExists: 'isCommentOf',
		})
		.sort('createdAt', 'desc')
		.getPaginated({
			pagination: {
				size: 5,
				after: query.paginationCursor ?? undefined,
			},
		})

	return {
		...userPostsPaginatedRaw,
		records: await getPostList<typeof userPostsPaginatedRaw.records>({
			event,
			posts: userPostsPaginatedRaw.records,
		}),
	}
})
