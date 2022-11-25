import { z, zh, useValidatedQuery } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
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
			bookmarkFolderId: z.string().optional(),
			bookmarkFolderUnsorted: zh.boolAsString.optional(),
			bookmarkFolderUserAuthId: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.bookmarkFolderUserAuthId)
		return sendError(event, createError({ statusCode: 403 }))

	const bookmarkFolderId = body.bookmarkFolderId

	const bookmarkQuery = e.shape(e.Bookmark, bookmark => ({
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
	}))

	// Load a specific folder by id.
	const queryById = e.select(e.BookmarkFolder, bookmarkFolder => ({
		...baseBookmarkFolder(bookmarkFolder),
		hasBookmarks: bookmark => ({
			...bookmarkQuery(bookmark),
		}),

		// ---
		filter_single: e.op(bookmarkFolder.id, '=', e.uuid(bookmarkFolderId || '')),
	}))

	try {
		if (!bookmarkFolderId) {
			if (!body.bookmarkFolderUnsorted)
				return sendError(event, createError({ statusCode: 400 }))

			// Load all bookmarks without folder
			const query = e.select(e.Bookmark, bookmark => ({
				...bookmarkQuery(bookmark),

				// ---
				filter: e.op('not', e.op('exists', bookmark.bookmarkFolder)),
			}))

			const hasBookmarks = await query.run(edgeDB)
			type ResObjType = Omit<
				NonNullable<$infer<typeof queryById>>,
				'createdAt' | 'updatedAt'
			>
			const resObj: ResObjType = {
				id: 'unsorted',
				name: 'Unsorted',
				icon: '💬',
				user: {
					authId: serverAuthUser.id,
				},
				hasBookmarks: hasBookmarks,
			}

			return resObj
		} else {
			return await queryById.run(edgeDB)
		}
	} catch (error) {
		return sendError(event, createError({ statusCode: 500 }))
	}
})
