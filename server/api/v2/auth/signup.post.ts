import { z, useValidatedBody } from 'h3-zod'
import { edgeDB } from '@/server/utils/v2/edgeDB'
import e from '@/dbschema/edgeql-js'
import { serverSupabaseClient } from '#supabase/server'

export const newUserQuery = e.params({ authId: e.str }, $ =>
	e
		.insert(e.User, {
			authId: $.authId,
			handle: `user-${Math.floor(
				Math.random() * (99999999 - 999999) + 999999
			)}`,
		})
		.unlessConflict(user => ({
			on: user.authId,
			else: user,
		}))
)

export default defineEventHandler(async event => {
	const supabase = serverSupabaseClient(event)
	const runtimeConfig = useRuntimeConfig()

	const body = await useValidatedBody(
		event,
		z.object({
			user: z.object({
				email: z.string(),
				password: z.string(),
			}),
		})
	)

	const redirectUrl = runtimeConfig.public.redirectUrl

	// First create the supabase auth user.
	const { data: authRes, error: authError } = await supabase.auth.signUp({
		email: body.user.email,
		password: body.user.password,
		options: {
			emailRedirectTo: redirectUrl,
		},
	})
	const authId = authRes.user?.id
	if (!authRes || !authId || authError) {
		return sendError(
			event,
			createError({ statusCode: 500, message: authError?.message })
		)
	}

	// Then add the user record to the database.
	try {
		return await newUserQuery.run(edgeDB, { authId })
	} catch (error) {
		console.error(error)
		return sendError(
			event,
			createError({ statusCode: 500, message: 'Failed to create user record.' })
		)
	}
})
