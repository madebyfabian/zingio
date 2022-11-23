import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
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
				id: z.string().optional(),
				post: z.object({
					id: z.string(),
				}),
				bookmarkFolder: z
					.object({
						id: z.string(),
					})
					.optional(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.postBookmark.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	const record = await xata.db.postBookmark.createOrUpdate({
		id: body.postBookmark.id ?? '',
		user: body.postBookmark.user.id,
		post: body.postBookmark.post.id,
		bookmarkFolder: body.postBookmark.bookmarkFolder?.id ?? null,
		updatedAt: new Date(),
		createdAt: body.postBookmark.id ? undefined : new Date(),
	})
	if (!record) return sendError(event, createError({ statusCode: 500 }))
	return record
})
