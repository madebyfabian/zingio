import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			bookmarkFolder: z.object({
				user: z.object({
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

	try {
		const query = e.delete(e.BookmarkFolder, bookmarkFolder => ({
			filter_single: { id: body.bookmarkFolder.id },
		}))

		const deletedRecord = await query.run(edgeDB)
		if (!deletedRecord)
			return sendError(event, createError({ statusCode: 410 }))
		return deletedRecord
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
