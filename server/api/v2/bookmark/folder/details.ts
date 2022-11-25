import { z, useValidatedQuery } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { basePost } from '../../feed/home'

export const baseBookmarkFolder = e.shape(e.BookmarkFolder, bookmarkFolder => ({
	...e.BookmarkFolder['*'],
	user: {
		authId: true,
	},
}))

export default defineEventHandler(async event => {
	const body = useValidatedQuery(
		event,
		z.object({
			bookmarkFolderId: z.string(),
			bookmarkFolderUserAuthId: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.bookmarkFolderUserAuthId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		const query = e.select(e.BookmarkFolder, bookmarkFolder => ({
			...baseBookmarkFolder(bookmarkFolder),
			hasBookmarks: {
				...e.Bookmark['*'],
				post: post => ({
					...basePost(post),

					/** @todo make this reusable, duplicated temporarly */
					_currentUserPostReaction: e.op(
						'exists',
						e.select(e.PostReaction, postReaction => ({
							filter: e.op(
								e.op(postReaction.id, 'in', post.postReactions.id),
								'and',
								e.op(postReaction.user.authId, '=', serverAuthUser.id)
							),
						}))
					),
				}),
			},
			// ---
			filter_single: e.op(
				bookmarkFolder.id,
				'=',
				e.uuid(body.bookmarkFolderId)
			),
		}))

		return await query.run(edgeDB)
	} catch (error) {
		return sendError(event, createError({ statusCode: 500 }))
	}
})
