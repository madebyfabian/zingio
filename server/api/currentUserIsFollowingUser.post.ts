import { z, useValidatedBody } from 'h3-zod'
import { serverSupabaseUser } from '#supabase/server'
import { xata } from '@/server/lib/xata'

export default defineEventHandler(async event => {
	const body = await useValidatedBody(
		event,
		z.object({
			userId: z.string(),
		})
	)
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	// Check if user is already following. And get the user
	const [currUserFollowing, user] = await Promise.all([
		xata.db.userFollowing
			.select(['*', 'user.*'])
			.filter({
				user: { authId: serverAuthUser.id },
				followsUser: { id: body.userId },
			})
			.getFirst(),
		xata.db.user
			.select(['*'])
			.filter({
				authId: serverAuthUser?.id,
			})
			.getFirstOrThrow(),
	])

	if (currUserFollowing) {
		// Unfollow
		const recordToDelete = await xata.db.userFollowing.delete({
			id: currUserFollowing.id,
		})
		if (!recordToDelete)
			return sendError(event, createError({ statusCode: 404 }))

		return recordToDelete
	} else {
		// Follow
		const newRecord = await xata.db.userFollowing.create({
			user: user.id,
			followsUser: body.userId,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		if (!newRecord) return sendError(event, createError({ statusCode: 404 }))

		// Send notification
		return newRecord
	}
})
