import { z, useValidatedBody } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			post: z.object({
				authorUser: z.object({
					id: z.string(),
					authId: z.string(),
				}),
				id: z.string(),
			}),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.post.authorUser.authId)
		return sendError(event, createError({ statusCode: 403 }))

	const updatedRecord = await xata.db.post.update({
		id: body.post.id,
		isDeleted: true,
	})
	if (!updatedRecord) return sendError(event, createError({ statusCode: 500 }))

	/** @TODO delete likes */
	/** @TODO set counter for countTotalComments and countTotalLikes -1 */

	return updatedRecord
})
