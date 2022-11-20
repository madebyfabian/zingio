import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
	theme: {
		container: {
			center: true,
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
		},
	},
}
