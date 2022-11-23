// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	typescript: {
		shim: false,
	},

	modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],

	runtimeConfig: {
		public: {
			redirectUrl:
				process.env.NODE_ENV === 'production'
					? 'https://zingio.vercel.app'
					: 'http://localhost:3000',
		},
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
			titleTemplate: '%s - zingio',
			link: [
				{
					rel: 'icon',
					href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💬</text></svg>',
				},
			],
		},
	},
})
