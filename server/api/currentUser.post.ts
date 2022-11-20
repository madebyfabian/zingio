import { z, useValidatedBody } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			currentUser: z.object({
				id: z.string(),
				authId: z.string(),
				name: z.string().optional(),
			}),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.currentUser.authId)
		return sendError(event, createError({ statusCode: 403 }))

	const updatedRecord = await xata.db.user.update({
		id: body.currentUser.id,
		name: body.currentUser.name,
		updatedAt: new Date(),
	})
	if (!updatedRecord) return sendError(event, createError({ statusCode: 500 }))

	return updatedRecord
})
