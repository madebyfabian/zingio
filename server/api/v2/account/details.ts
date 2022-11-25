import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'
import { serverSupabaseUser } from '#supabase/server'
import { newUserQuery } from '../auth/signup.post'

const getUserQuery = e.params({ authId: e.str }, $ =>
	e.select(e.User, user => ({
		...e.User['*'],
		filter_single: e.op(user.authId, '=', $.authId),
	}))
)

export default defineEventHandler(async event => {
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	try {
		// Get current user
		const currentUser = await getUserQuery.run(edgeDB, {
			authId: serverAuthUser.id,
		})
		if (currentUser) return currentUser

		// There may be no `currentUser` bcs. user signed up with github, but does not have a record in the db.
		// If so, create the user record in the database.
		const newUserRecord = await newUserQuery.run(edgeDB, {
			authId: serverAuthUser.id,
		})

		// Get new user record
		const currentNewUser = await getUserQuery.run(edgeDB, {
			authId: serverAuthUser.id,
		})
		if (!newUserRecord)
			return sendError(event, createError({ statusCode: 500 }))
		return currentNewUser
	} catch (error) {
		console.error(error)
		return sendError(event, createError({ statusCode: 500 }))
	}
})
