import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			post: z.object({
				authorUser: z.object({
					authId: z.string(),
				}),
				id: z.string(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.post.authorUser.authId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		const query = e.update(e.Post, post => ({
			set: {
				isDeleted: true,
				updatedAt: e.datetime_current(),
			},
			filter_single: { id: body.post.id },
		}))

		return await query.run(edgeDB)
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 410 }))
	}
})
