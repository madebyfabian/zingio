import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

const nonNullable = <T>(value: T): value is NonNullable<T> => {
	return value !== null && value !== undefined
}

export default defineEventHandler(async event => {
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const usersFollowing = await xata.db.userFollowing
		.select(['id', 'followsUser.id'])
		.filter({ user: { authId: serverAuthUser.id } })
		.getMany()

	const usersFollowingIds = usersFollowing
		.map(user => user.followsUser?.id)
		.filter(nonNullable)
	if (!usersFollowingIds.length) return []

	const postsOLD = await xata.db.post
		.select(['*', 'authorUser.*'])
		.filter({
			authorUser: { id: { $any: usersFollowingIds } },
			isDeleted: false,
			$notExists: 'isCommentOf',
		})
		.sort('createdAt', 'desc')
		.getMany()

	/** @TODO This does not work properly, only returns 1 object (should return multiple) */
	const postsNew = await xata.db.postLikes.summarize({
		columns: ['post.*', 'post.authorUser.*'],
		summaries: {
			likesTotal: { sum: '_counter' },
		},
		filter: {
			post: {
				authorUser: { id: { $any: usersFollowingIds } },
				$notExists: 'isCommentOf',
				isDeleted: false,
			},
		},
	})

	return {
		posts: postsOLD,
		postsNew,
	}
})
