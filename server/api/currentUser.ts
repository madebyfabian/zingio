import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)

	// If this route gets called and there is no session at all
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	const currentUser = await xata.db.user
		.select(['*'])
		.filter({
			authId: serverAuthUser.id,
		})
		.getFirst()

	// This may be because user signed up with github, but does not have a record in the db.
	if (!currentUser) {
		// Create the user record in the database.
		const newUserRecord = await xata.db.user.create({
			authId: serverAuthUser.id,
			handle: `user-${serverAuthUser.id}`,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		if (!newUserRecord)
			return sendError(
				event,
				createError({
					statusCode: 500,
					message: 'Failed to create user record.',
				})
			)

		return newUserRecord
	}

	return currentUser
})
