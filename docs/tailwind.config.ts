import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './theme.config.tsx'
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  darkMode: 'class'
} satisfies Config
