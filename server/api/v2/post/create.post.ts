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
				content: z.string(),
				replyToPost: z
					.object({
						id: z.string(),
					})
					.optional(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.post.authorUser.authId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		const replyToPostId = body.post.replyToPost?.id
		const query = e.insert(e.Post, {
			content: body.post.content,
			authorUser: e.select(e.User, user => ({
				filter_single: e.op(user.authId, '=', serverAuthUser.id),
			})),
			replyToPost: replyToPostId
				? e.select(e.Post, post => ({
						filter_single: { id: replyToPostId },
				  }))
				: undefined,
		})
		return await query.run(edgeDB)
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
