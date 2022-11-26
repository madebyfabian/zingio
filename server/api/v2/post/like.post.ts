import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'
import { ConstraintViolationError } from 'edgedb'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			postId: z.string(),
			user: z.object({
				authId: z.string(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		// Check if user has already liked the post
		const query = e.insert(e.PostReaction, {
			user: e.select(e.User, user => ({
				filter_single: e.op(user.authId, '=', serverAuthUser.id),
			})),
			post: e.select(e.Post, post => ({
				filter_single: e.op(post.id, '=', e.uuid(body.postId)),
			})),
		})

		const result = await query.run(edgeDB)

		return result
	} catch (error) {
		if (!(error instanceof ConstraintViolationError)) {
			console.error(error)
			return sendError(event, createError({ statusCode: 422 }))
		}

		// This error caused by because the user has already liked the post.
		// So we delete the reaction.
		try {
			const query = e.delete(e.PostReaction, postReaction => ({
				filter_single: e.op(
					e.op(postReaction.post.id, '=', e.uuid(body.postId)),
					'and',
					e.op(postReaction.user.authId, '=', serverAuthUser.id)
				),
			}))

			return await query.run(edgeDB)
		} catch (error) {
			console.error(error)
			return sendError(event, createError({ statusCode: 422 }))
		}
	}
})
