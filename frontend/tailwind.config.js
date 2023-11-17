/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	variants: {
		extend: {
			display: ["group-hover"],
		},
	},
	theme: {
		fontFamily: {
			poppins: ['Poppins', 'sans-serif']
		},
		extend: {
			backgroundImage: {
				'rainbow-gradient':
					'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)'
			},
			animation: {
				tilt: 'tilt 10s infinite linear',
				blob: 'blob 7s infinite'
			},
			keyframes: {
				tilt: {
					'0% 50% 100%': {
						transform: 'rotate(0deg)'
					},
					'25%': {
						transform: 'rotate(1deg)'
					},
					'75%': {
						transform: 'rotate(1.1deg)'
					}
				},
				blob: {
					'0%': {
						transform: 'translate(0px, 0px) scale(1)'
					},
					'33%': {
						transform: 'translate(30px, -50px) scale(1.1)'
					},
					'66%': {
						transform: 'translate(-20px, 20px) scale(0.9)'
					},
					'100%': {
						transform: 'translate(0px, 0px) scale(1)'
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
