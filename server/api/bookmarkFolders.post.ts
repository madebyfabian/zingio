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

	const newRecord = await xata.db.bookmarkFolder.createOrUpdate({
		id: body.bookmarkFolder.id ?? '',
		user: body.bookmarkFolder.user.id,
		name: body.bookmarkFolder.name,
		icon: body.bookmarkFolder.icon,
		createdAt: body.bookmarkFolder.id ? undefined : new Date(),
		updatedAt: new Date(),
	})
	if (!newRecord) return sendError(event, createError({ statusCode: 500 }))

	return newRecord
})
