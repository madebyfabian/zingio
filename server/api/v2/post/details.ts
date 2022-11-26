import { z, useValidatedQuery } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { basePost } from '../feed/home'

export default defineEventHandler(async event => {
	const body = useValidatedQuery(
		event,
		z.object({
			postId: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		/** e.assert_single fixes @see https://discord.com/channels/841451783728529451/1004076486971637792/1004079211260149760 */
		const postQuery = e.assert_single(
			e.select(e.Post, post => ({
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
				filter_single: e.op(post.id, '=', e.uuid(body.postId)),
			}))
		)

		const postCommentsQuery = e.select(e.Post, post => ({
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
			filter: e.op(post.replyToPost.id, '=', e.uuid(body.postId)),
		}))

		const [post, postComments] = await Promise.all([
			postQuery.run(edgeDB),
			postCommentsQuery.run(edgeDB),
		])

		return {
			post,
			postComments,
		}
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
