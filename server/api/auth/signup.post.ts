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

	const redirectUrl =
		process.env.NODE_ENV === 'production'
			? 'https://zingio.vercel.app'
			: 'http://localhost:3000'

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

	// Check if the account in database already exists.
	const user = await xata.db.user.select(['id']).filter({ authId }).getFirst()

	// Then create the user record in the database.
	const newUserRecord = await xata.db.user.createOrUpdate({
		id: user?.id ?? '',
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
