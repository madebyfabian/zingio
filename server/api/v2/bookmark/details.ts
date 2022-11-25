import { z, useValidatedQuery } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'

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
			postId: z.string(),
			bookmarkUserAuthId: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.bookmarkUserAuthId)
		return sendError(event, createError({ statusCode: 403 }))

	try {
		/** e.assert_single fixes @see https://discord.com/channels/841451783728529451/1004076486971637792/1004079211260149760 */
		const query = e.assert_single(
			e.select(e.Bookmark, bookmark => ({
				...e.Bookmark['*'],
				bookmarkFolder: {
					id: true,
				},

				// ---
				filter_single: e.op(
					e.op(bookmark.user.authId, '=', serverAuthUser.id),
					'and',
					e.op(bookmark.post.id, '=', e.uuid(body.postId))
				),
			}))
		)

		return await query.run(edgeDB)
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
