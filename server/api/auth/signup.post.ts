import { z, useValidatedBody } from 'h3-zod'
import { xata } from '@/server/lib/xata'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async event => {
	const supabase = serverSupabaseClient(event)

	const body = await useValidatedBody(
		event,
		z.object({
			user: z.object({
				email: z.string(),
				password: z.string(),
			}),
		})
	)

	// First create the supabase auth user.
	const { data: authRes, error: authError } = await supabase.auth.signUp({
		email: body.user.email,
		password: body.user.password,
	})
	const authId = authRes.user?.id
	if (!authRes || !authId || authError) {
		return sendError(
			event,
			createError({ statusCode: 500, message: authError?.message })
		)
	}

	// Then create the user record in the database.
	const newUserRecord = await xata.db.user.create({
		authId: authId,
		handle: `user-${authId}`,
		createdAt: new Date(),
		updatedAt: new Date(),
	})
	if (!newUserRecord)
		return sendError(
			event,
			createError({ statusCode: 500, message: 'Failed to create user record.' })
		)

	return newUserRecord
})
