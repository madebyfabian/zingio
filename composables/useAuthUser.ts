export const useAuthUser = () => {
	const supabaseUser = useSupabaseUser()
	return supabaseUser
}
