import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			account: z.object({
				authId: z.string(),
				name: z.string().trim().min(1).max(32),
				description: z.string().optional().nullable(),
				handle: z
					.string()
					.trim()
					.min(3)
					.max(20)
					.regex(/^[a-zA-Z0-9\_\-\.]+$/),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.account.authId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		const query = e.update(e.User, u => ({
			set: {
				name: body.account.name,
				description: body.account.description,
				handle: body.account.handle,
				updatedAt: e.datetime_current(),
			},
			filter_single: e.op(u.authId, '=', body.account.authId),
		}))

		return await query.run(edgeDB)
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 422 }))
	}
})
