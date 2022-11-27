import { z, useValidatedQuery } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { baseUser } from './list'

const userDetailsQuery = e.params(
	{ userHandle: e.str, serverAuthUserId: e.str },
	$ =>
		e.select(e.User, user => ({
			...e.User['*'],
			followingUsers: {
				'@createdAt': true,
				...baseUser(user),
			},

			_followingUsersCount: e.count(user.followingUsers),
			_isFollowedByUsersCount: e.count(user.isFollowedByUsers),
			_postsCount: e.count(user.posts),

			/** @todo make this reusable, currently duplicated! */
			_currentUserIsFollowing: e.op(
				'exists',
				e.select(e.User, userFollowing => ({
					filter_single: e.op(
						e.op(userFollowing.id, '=', user.id),
						'and',
						e.op(
							userFollowing['isFollowedByUsers']['authId'],
							'=',
							$.serverAuthUserId
						)
					),
				}))
			),

			// ---
			filter_single: e.op(user.handle, '=', $.userHandle),
		}))
)

export type UserDetail = $infer<typeof userDetailsQuery>

export default defineEventHandler(async event => {
	const body = useValidatedQuery(
		event,
		z.object({
			userHandle: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		const user = await userDetailsQuery.run(edgeDB, {
			userHandle: body.userHandle,
			serverAuthUserId: serverAuthUser.id,
		})
		if (!user) return sendError(event, createError({ statusCode: 404 }))
		return user
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
