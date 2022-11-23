import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const bookmarkFolders = await xata.db.bookmarkFolder
		.select(['*', 'user.id', 'user.authId'])
		.filter({
			user: { authId: serverAuthUser.id },
		})
		.getMany()

	if (!bookmarkFolders) return []
	return bookmarkFolders
})
