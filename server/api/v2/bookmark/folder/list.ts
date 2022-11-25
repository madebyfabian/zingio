import { edgeDB } from '@/server/utils/v2/edgeDB'
import e, { $infer } from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { baseBookmarkFolder } from './details'

const query = e.params({ serverAuthUserId: e.str }, $ =>
	e.select(e.BookmarkFolder, bookmarkFolder => ({
		...baseBookmarkFolder(bookmarkFolder),
		_count_hasBookmarks: e.count(bookmarkFolder.hasBookmarks),

		// ---
		filter: e.op(bookmarkFolder.user.authId, '=', $.serverAuthUserId),
	}))
)

export type BookmarkFolderListItem = $infer<typeof query>[0]

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		return await query.run(edgeDB, {
			serverAuthUserId: serverAuthUser.id,
		})
	} catch (error) {
		return sendError(event, createError({ statusCode: 500 }))
	}
})
