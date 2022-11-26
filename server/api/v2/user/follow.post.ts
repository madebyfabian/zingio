import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			userId: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		// Check if current user account has already followed
		const alreadyFollowingUserQuery = e.select(e.User, user => ({
			filter_single: e.op(
				e.op(user.id, '=', e.uuid(body.userId)),
				'and',
				e.op(user.isFollowedByUsers.authId, 'in', serverAuthUser.id)
			),
		}))

		const alreadyFollowingUser = await alreadyFollowingUserQuery.run(edgeDB)

		if (alreadyFollowingUser?.id) {
			// Already following, unfollow
			const query = e.update(e.User, currUser => ({
				set: {
					followingUsers: {
						'-=': alreadyFollowingUserQuery,
					},
					updatedAt: e.datetime_current(),
				},
				filter_single: e.op(currUser.authId, '=', serverAuthUser.id),
			}))

			return await query.run(edgeDB)
		} else {
			// Not following, follow
			const query = e.update(e.User, currUser => ({
				set: {
					followingUsers: {
						'+=': e.select(e.User, user => ({
							filter_single: e.op(user.id, '=', e.uuid(body.userId)),
						})),
					},
					updatedAt: e.datetime_current(),
				},
				filter_single: e.op(currUser.authId, '=', serverAuthUser.id),
			}))

			return await query.run(edgeDB)
		}
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 422 }))
	}
})
