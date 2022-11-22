import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default <Partial<Config>>{
	theme: {
		container: {
			center: true,
			padding: '1.25rem',
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
		},
		extend: {
			borderColor: {
				DEFAULT: colors?.gray[200],
			},
		},
	},
}
