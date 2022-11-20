import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
		})
	)

	const userDetails = await xata.db.user
		.select(['*'])
		.filter({
			handle: query.userHandle,
		})
		.getFirst()
	if (!userDetails) return sendError(event, createError({ statusCode: 404 }))

	return userDetails
})
