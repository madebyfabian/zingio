import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'

export const baseUser = e.shape(e.User, user => ({
	id: true,
	name: true,
	handle: true,
}))

const query = e.params({ serverAuthUserId: e.str }, $ =>
	e.select(e.User, user => ({
		...baseUser(user),

		/** @todo make this reusable, currently duplicated! maybe with "computed field" */
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
	}))
)

export type UserListItem = Omit<
	$infer<typeof query>[0],
	'_currentUserIsFollowing'
>

export type UserListItemExtended = $infer<typeof query>[0]

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		return await query.run(edgeDB, { serverAuthUserId: serverAuthUser.id })
	} catch (error) {
		return sendError(event, createError({ statusCode: 500 }))
	}
})
