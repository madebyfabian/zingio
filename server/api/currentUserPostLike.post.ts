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

	// Check if the user has already liked the post. ALso get the post by id.
	const [existingLike, post] = await Promise.all([
		xata.db.postLikes
			.select(['id'])
			.filter({
				post: { id: body.postId },
				user: { id: body.user.id },
			})
			.getFirst(),

		xata.db.post
			.select(['id', 'countTotalLikes'])
			.filter({ id: body.postId })
			.getFirst(),
	])

	// Prepare the transaction that will increment/decrement the post's total likes count.
	const preparedUpdateCounterTransaction = xata.db.post.update({
		id: body.postId,
		countTotalLikes:
			typeof post?.countTotalLikes === 'number'
				? existingLike
					? post.countTotalLikes - 1
					: post?.countTotalLikes + 1
				: undefined,
	})

	if (existingLike) {
		// If the user has already liked the post, delete the like
		const [deletedLike, updateCounterTransaction] = await Promise.all([
			xata.db.postLikes.delete({
				id: existingLike.id,
			}),
			preparedUpdateCounterTransaction,
		])
		if (!deletedLike || !updateCounterTransaction)
			return sendError(event, createError({ statusCode: 500 }))
		return deletedLike
	} else {
		// If the user has not already liked the post, create a new like
		const [newLike, updateCounterTransaction] = await Promise.all([
			xata.db.postLikes.create({
				post: { id: body.postId },
				user: { id: body.user.id },
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
			preparedUpdateCounterTransaction,
		])
		if (!newLike || !updateCounterTransaction)
			return sendError(event, createError({ statusCode: 500 }))
		return newLike
	}
})
