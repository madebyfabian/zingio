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
				id: z.string().optional(),
				name: z.string(),
				icon: z.string().optional(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.bookmarkFolder.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		const bookmarkFolderId = body.bookmarkFolder.id

		if (bookmarkFolderId) {
			// Update
			const query = e.update(e.BookmarkFolder, bookmarkFolder => ({
				filter_single: e.op(bookmarkFolder.id, '=', e.uuid(bookmarkFolderId)),
				set: {
					name: body.bookmarkFolder.name,
					icon: body.bookmarkFolder.icon,
					/** @todo missing `updatedAt` */
				},
			}))
			return await query.run(edgeDB)
		} else {
			// Create new
			const query = e.insert(e.BookmarkFolder, {
				/** @todo better typing */
				// @ts-ignore
				user: e.select(e.User, user => ({
					filter_single: { authId: body.bookmarkFolder.user.authId },
				})),
				name: body.bookmarkFolder.name,
				icon: body.bookmarkFolder.icon,
			})
			return await query.run(edgeDB)
		}
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 410 }))
	}
})
