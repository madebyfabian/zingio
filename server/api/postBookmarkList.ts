import { z, zh, useValidatedQuery } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'
import { getPostList } from '@/server/utils/getPostList'

const nonNullable = <T>(value: T): value is NonNullable<T> => {
	return value !== null && value !== undefined
}

export default defineEventHandler(async event => {
	const query = useValidatedQuery(
		event,
		z.object({
			bookmarkFolderId: z.string().optional(),
			onlyUnsorted: zh.boolAsString.optional(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const [postBookmarkList, bookmarkFolder] = await Promise.all([
		xata.db.postBookmark
			.select([
				'*',
				'user.id',
				'user.authId',
				'bookmarkFolder.id',
				'post.authorUser.id',
			])
			.filter(
				query.onlyUnsorted
					? {
							user: { authId: serverAuthUser.id },
							$notExists: 'bookmarkFolder',
					  }
					: {
							user: { authId: serverAuthUser.id },
							bookmarkFolder: { id: query.bookmarkFolderId },
					  }
			)
			.getMany(),

		xata.db.bookmarkFolder
			.select(['*', 'user.id', 'user.authId'])
			.filter(
				query.onlyUnsorted
					? {
							user: { authId: serverAuthUser.id },
					  }
					: {
							id: query.bookmarkFolderId,
							user: { authId: serverAuthUser.id },
					  }
			)
			.getFirst(),
	])

	const postsIds = postBookmarkList
		.map(postBookmark => postBookmark.post?.id)
		.filter(nonNullable)
	if (!postsIds.length) return { posts: [], bookmarkFolder }

	const postsRaw = await xata.db.post
		.select(['*', 'authorUser.*'])
		.filter({
			id: { $any: postsIds },
			isDeleted: false,
		})
		.sort('createdAt', 'desc')
		.getMany()

	const posts = await getPostList<typeof postsRaw>({
		event,
		posts: postsRaw,
	})

	return {
		posts,
		bookmarkFolder: bookmarkFolder,
	}
})
