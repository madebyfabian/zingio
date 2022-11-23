import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const currentUser = await xata.db.user
		.select(['*'])
		.filter({
			authId: serverAuthUser.id,
		})
		.getFirst()

	if (!currentUser) return sendError(event, createError({ statusCode: 404 }))

	return currentUser
})
