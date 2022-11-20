// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],

	typescript: {
		shim: false,
	},

	routeRules: {
		'/auth/**': {
			ssr: false,
		},
		'/account/**': {
			ssr: false,
		},
		'/': {
			ssr: false,
		},
		'/api/**': {
			cors: true,
		},
	},
})
