/** @type {import('tailwindcss').Config} */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				muted: {
					foreground: 'hsl(var(--muted-foreground))',
				},
				foreground: 'hsl(var(--foreground))',
			},
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'system-ui',
					'Roboto',
					'Helvetica Neue',
					'Segoe UI',
					'Apple SD Gothic Neo',
					'Noto Sans KR',
					'Malgun Gothic',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'sans-serif',
				],
			},
		},
	},
	plugins: [],
};
