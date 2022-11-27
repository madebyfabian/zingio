import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
	const startTime = +new Date()
	console.log(startTime, 'start')
	const serverAuthUser = await serverSupabaseUser(event)
	if (!serverAuthUser) return sendError(event, createError({ statusCode: 401 }))

	console.log(+new Date(), 'end', { took: +new Date() - startTime })
	return true
})
