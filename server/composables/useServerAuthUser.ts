import { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export const useServerAuthUser = (event: H3Event) => {
	return serverSupabaseUser(event)
}
