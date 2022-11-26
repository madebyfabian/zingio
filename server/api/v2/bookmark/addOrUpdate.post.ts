import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			bookmark: z.object({
				user: z.object({
					authId: z.string(),
				}),
				id: z.string().optional(),
				post: z.object({
					id: z.string(),
				}),
				bookmarkFolder: z
					.object({
						id: z.string(),
					})
					.optional(),
			}),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.bookmark.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		const bookmarkId = body.bookmark.id
		const bookmarkFolderNew = body.bookmark.bookmarkFolder
		if (bookmarkId) {
			// We want to update the bookmark
			// If there is a bookmarkFolder in body define, we want to override it.
			// If there is no bookmarkFolder in body define, we want to remove it.

			const query = e.update(e.Bookmark, _ => ({
				set: {
					updatedAt: e.datetime_current(),
					// override bookmarkFolder
					bookmarkFolder: bookmarkFolderNew
						? e.select(e.BookmarkFolder, bookmarkFolder => ({
								filter_single: e.op(
									e.op(bookmarkFolder.id, '=', e.uuid(bookmarkFolderNew.id)),
									'and',
									e.op(bookmarkFolder.user.authId, '=', serverAuthUser.id)
								),
						  }))
						: null,
				},
				filter_single: { id: e.uuid(bookmarkId) },
			}))

			return await query.run(edgeDB)
		} else {
			// create bookmark
			const query = e.insert(e.Bookmark, {
				user: e.select(e.User, user => ({
					filter_single: e.op(user.authId, '=', body.bookmark.user.authId),
				})),
				post: e.select(e.Post, _ => ({
					filter_single: { id: e.uuid(body.bookmark.post.id) },
				})),
				// @ts-ignore
				bookmarkFolder: bookmarkFolderNew
					? e.select(e.BookmarkFolder, _ => ({
							filter_single: { id: e.uuid(bookmarkFolderNew.id || '') },
					  }))
					: undefined,
			})
			return await query.run(edgeDB)
		}
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
