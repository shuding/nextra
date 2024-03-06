import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./{components,pages}/**/*.{mdx,tsx}', './theme.config.tsx']
} satisfies Config
