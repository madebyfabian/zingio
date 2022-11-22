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

	app: {
		head: {
			titleTemplate: '%s - Timmo',
			link: [
				{
					rel: 'icon',
					href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💬</text></svg>',
				},
			],
		},
	},
})
