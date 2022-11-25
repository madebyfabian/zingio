import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'

export const basePost = e.shape(e.Post, post => ({
	id: true,
	content: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
	_count_postReactions: e.count(post.postReactions),
	_count_postComments: e.count(
		e.select(e.Post, postComment => ({
			filter: e.op(postComment.id, '=', post.replyToPost.id),
		}))
	),
	authorUser: {
		id: true,
		name: true,
		handle: true,
	},

	// ---
	order_by: post.createdAt,
}))

/** @todo make this reusable, check for `_currentUserPostReaction` in code. */
export type BasePost = $infer<typeof basePost>[0] & {
	_currentUserPostReaction: boolean
}

const query = e.params({ serverAuthUserId: e.str }, $ =>
	e.select(e.Post, post => ({
		...basePost(post),
		replyToPost: basePost,

		/** @todo make this reusable, duplicated temporarly */
		_currentUserPostReaction: e.op(
			'exists',
			e.select(e.PostReaction, postReaction => ({
				filter: e.op(
					e.op(postReaction.id, 'in', post.postReactions.id),
					'and',
					e.op(postReaction.user.authId, '=', $.serverAuthUserId)
				),
			}))
		),

		// ---
		/*limit: 10,
		offset: 0,*/
		filter: e.op(
			post['authorUser']['isFollowedByUsers']['authId'],
			'=',
			$.serverAuthUserId
		),
	}))
)

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		return await query.run(edgeDB, {
			serverAuthUserId: serverAuthUser.id,
		})
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
