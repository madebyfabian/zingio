import { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export const useServerAuthUser = async (event: H3Event) => {
	const serverAuthUser = await serverSupabaseUser(event)
	return serverAuthUser
}
