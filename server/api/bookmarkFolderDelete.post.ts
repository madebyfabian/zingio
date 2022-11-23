import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			bookmarkFolder: z.object({
				user: z.object({
					id: z.string(),
					authId: z.string(),
				}),
				id: z.string(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.bookmarkFolder.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	const deletedRecord = await xata.db.bookmarkFolder.delete({
		id: body.bookmarkFolder.id,
		user: body.bookmarkFolder.user.id,
	})
	if (!deletedRecord) return sendError(event, createError({ statusCode: 500 }))

	return deletedRecord
})
