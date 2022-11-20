import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

const nonNullable = <T>(value: T): value is NonNullable<T> => {
	return value !== null && value !== undefined
}

export default defineEventHandler(async event => {
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const usersFollowing = await xata.db.userFollowing
		.select(['*', 'followsUser.*'])
		.filter({ user: { authId: serverAuthUser.id } })
		.getMany()

	const usersFollowingIds = usersFollowing
		.map(user => user.followsUser?.id)
		.filter(nonNullable)
	if (!usersFollowingIds.length) return []

	const posts = await xata.db.post
		.select(['*', 'authorUser.*'])
		.filter({
			authorUser: { id: { $any: usersFollowingIds } },
			isDeleted: false,
			$notExists: 'isCommentOf',
		})
		.sort('createdAt', 'desc')
		.getMany()

	return posts
})
