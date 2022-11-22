import { xata } from '@/server/lib/xata'
import { getUserList } from '@/server/utils/getUserList'

export default defineEventHandler(async event => {
	const usersRaw = await xata.db.user.select(['*']).getMany()

	if (!usersRaw) return sendError(event, createError({ statusCode: 404 }))

	const userList = await getUserList<typeof usersRaw>({
		users: usersRaw,
		event,
	})

	return userList
})
