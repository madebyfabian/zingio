import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const serverAuthUser = await useServerAuthUser(event)
	const serverAuthUserId = serverAuthUser?.id
	if (!serverAuthUserId)
		return sendError(event, createError({ statusCode: 401 }))

	const currentUser = await xata.db.user
		.select(['*'])
		.filter({
			authId: serverAuthUserId,
		})
		.getFirstOrThrow()

	if (!currentUser) return sendError(event, createError({ statusCode: 404 }))

	return currentUser
})
