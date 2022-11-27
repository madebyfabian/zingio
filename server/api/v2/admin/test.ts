import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { baseUser } from '../user/list'

export const basePost = e.shape(e.Post, post => ({
	id: true,
	content: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
	replyToPost: true,
	_count_postReactions: e.count(post.allPostReactions),
	_count_postComments: e.count(post.allPostReplies),
	authorUser: authorUser => ({
		...baseUser(authorUser),
	}),

	// ---
	order_by: post.createdAt,
}))

const query = e.params({ serverAuthUserId: e.str }, $ =>
	e.select(e.Post, post => ({
		...basePost(post),
		replyToPost: basePost,

		_currentUserPostReaction: e.op(
			'exists',
			e.select(e.PostReaction, postReaction => ({
				filter: e.op(
					e.op(postReaction.post.id, '=', post.id),
					'and',
					e.op(postReaction.user.authId, '=', $.serverAuthUserId)
				),
			}))
		),

		// ---
		filter: e.op(
			e.op(
				e.op(
					post['authorUser']['isFollowedByUsers']['authId'],
					'=',
					$.serverAuthUserId
				),
				'and',
				e.op(post.isDeleted, '=', false)
			),
			'and',
			e.op('not', e.op('exists', post.replyToPost))
		),
	}))
)

export default defineEventHandler(async event => {
	console.log(
		'this is a test. it does everything I would do in the feed/home.ts, instead of actually getting data.'
	)
	console.log(+new Date(), 'start')
	/*const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))*/

	try {
		/*return await query.run(edgeDB, {
			serverAuthUserId: serverAuthUser.id,
		})*/

		console.log(+new Date(), 'end')
		return true
	} catch (error) {
		console.error(error)
		console.log(+new Date(), 'end')
		return sendError(event, createError({ statusCode: 500 }))
	}
})
