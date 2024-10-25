import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import docsConfig from '../nextra-theme-docs/tailwind.config'

export default {
  prefix: docsConfig.prefix,
  content: docsConfig.content,
  theme: {
    colors: {
      ...docsConfig.theme.colors,
      primary: colors.blue
    }
  },
  darkMode: docsConfig.darkMode,
  plugins: [typography]
} satisfies Config
