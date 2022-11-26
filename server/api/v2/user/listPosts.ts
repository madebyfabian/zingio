import { z, zh, useValidatedQuery } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { basePost } from '../feed/home'

export default defineEventHandler(async event => {
	const body = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
			paginationPage: zh.numAsString,
		})
	)

	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		const pageSize = 5

		const query = e.select(e.Post, post => ({
			...basePost(post),

			/** @todo make this reusable, duplicated temporarly */
			_currentUserPostReaction: e.op(
				'exists',
				e.select(e.PostReaction, postReaction => ({
					filter: e.op(
						e.op(postReaction.post.id, '=', post.id),
						'and',
						e.op(postReaction.user.authId, '=', serverAuthUser.id)
					),
				}))
			),

			// ---
			limit: pageSize,
			offset: body.paginationPage * pageSize,
			filter: e.op(
				e.op(post.authorUser.handle, '=', body.userHandle),
				'and',
				e.op(post.isDeleted, '=', false)
			),
		}))

		const posts = await query.run(edgeDB)

		return {
			posts,
			pagination: {
				page: body.paginationPage ?? 0,
				prevPage: body.paginationPage > 0 ? body.paginationPage - 1 : null,
				nextPage: posts.length === pageSize ? body.paginationPage + 1 : null,
			},
		}
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
