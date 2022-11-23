import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'
import type { UserRecord } from '@/server/lib/xata/gen/client.gen'
import { UserExtension } from '@/types'

export const getUserList = async <R extends { id: UserRecord['id'] }[]>({
	users,
	event,
}: {
	users: R
	event: H3Event
}) => {
	const serverAuthUser = await serverSupabaseUser(event)

	// If user logged in, get list of users they're following
	const currentUserIsFollowingUsers =
		!users.length || !serverAuthUser
			? []
			: await xata.db.userFollowing
					.select(['*', 'followsUser.*'])
					.filter({
						user: { authId: serverAuthUser.id },
						followsUser: { id: { $any: users.map(user => user.id) } },
					})
					.getMany()

	return users.map(user => {
		const userIsFollowing = currentUserIsFollowingUsers.find(
			userFollowing => userFollowing.followsUser?.id === user.id
		)
		const returnObj: R[0] & UserExtension = {
			...user,
			currentUser: {
				isFollowing: !serverAuthUser ? undefined : !!userIsFollowing,
			},
		}
		return returnObj
	})
}
