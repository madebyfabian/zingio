import { z, useValidatedBody } from 'h3-zod'
import { useServerAuthUser } from '@/server/composables/useServerAuthUser'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			postId: z.string(),
			user: z.object({
				id: z.string(),
				authId: z.string(),
			}),
		})
	)
	const serverAuthUser = await useServerAuthUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))
	if (serverAuthUser.id !== body.user.authId)
		return sendError(event, createError({ statusCode: 403 }))

	// Check if the user has already liked the post
	const existingLike = await xata.db.postLikes
		.select(['id'])
		.filter({
			post: { id: body.postId },
			user: { id: body.user.id },
		})
		.getFirst()

	if (existingLike) {
		// If the user has already liked the post, delete the like
		const deletedLike = await xata.db.postLikes.delete({
			id: existingLike.id,
		})
		if (!deletedLike) return sendError(event, createError({ statusCode: 500 }))
		return deletedLike
	} else {
		// If the user has not already liked the post, create a new like
		const newLike = await xata.db.postLikes.create({
			post: { id: body.postId },
			user: { id: body.user.id },
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		if (!newLike) return sendError(event, createError({ statusCode: 500 }))
		return newLike
	}
})
