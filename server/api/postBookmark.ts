import { z, zh, useValidatedQuery } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			postId: z.string(),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const postBookmark = await xata.db.postBookmark
		.select(['*', 'user.id', 'user.authId'])
		.filter({
			user: { authId: serverAuthUser.id },
			post: { id: query.postId },
		})
		.getFirst()

	return postBookmark
})