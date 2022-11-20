import { z, useValidatedQuery } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			userId: z.string(),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const userFollowing = await xata.db.userFollowing
		.select(['*'])
		.filter({
			user: { authId: serverAuthUser.id },
			followsUser: { id: query.userId },
		})
		.getFirst()

	return userFollowing
})
