import { z, useValidatedQuery } from 'h3-zod'
import { xata } from '@/server/lib/xata'
import { getUserList } from '@/server/utils/getUserList'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
		})
	)

	const userRaw = await xata.db.user
		.select(['*'])
		.filter({
			handle: query.userHandle,
		})
		.getFirst()

	if (!userRaw) return sendError(event, createError({ statusCode: 404 }))

	const userList = await getUserList<typeof userRaw[]>({
		users: [userRaw],
		event,
	})

	return userList[0]
})
