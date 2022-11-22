import { z, useValidatedBody } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			currentUser: z.object({
				id: z.string(),
				authId: z.string(),
				name: z.string().trim().min(1).max(32),
				handle: z
					.string()
					.trim()
					.min(3)
					.max(20)
					.regex(/^[a-zA-Z0-9\_\-\.]+$/),
			}),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.currentUser.authId)
		return sendError(event, createError({ statusCode: 403 }))

	// First get existing user
	const existingUser = await xata.db.user
		.select(['*'])
		.filter({ authId: serverAuthUser.id })
		.getFirstOrThrow()

	const hasChangedHandle = existingUser.handle !== body.currentUser.handle
	if (hasChangedHandle) {
		// Check if handle is already taken
		const existingUserWithHandle = await xata.db.user
			.select(['*'])
			.filter({ handle: body.currentUser.handle })
			.getFirst()
		if (existingUserWithHandle)
			return sendError(event, createError({ statusCode: 409 }))
	}

	const updatedRecord = await xata.db.user.update({
		id: body.currentUser.id,
		name: body.currentUser.name,
		handle: body.currentUser.handle,
		updatedAt: new Date(),
	})
	if (!updatedRecord) return sendError(event, createError({ statusCode: 500 }))

	return updatedRecord
})
