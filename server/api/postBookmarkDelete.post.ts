import { z, useValidatedBody } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			postBookmark: z.object({
				user: z.object({
					id: z.string(),
					authId: z.string(),
				}),
				id: z.string(),
			}),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.postBookmark.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	const deletedRecord = await xata.db.postBookmark.delete({
		id: body.postBookmark.id,
		user: body.postBookmark.user.id,
	})
	if (!deletedRecord) return sendError(event, createError({ statusCode: 500 }))

	return deletedRecord
})
