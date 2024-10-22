import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./{app,mdx}/**/*.{mdx,tsx,svg}']
} satisfies Config
