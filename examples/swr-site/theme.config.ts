/* eslint sort-keys: error */
import { useConfig } from 'nextra-theme-docs'

const config = {
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
    useLink() {
      const config = useConfig()
      return `https://google.com/search?q=${encodeURIComponent(
        // @ts-expect-error
        `Feedback for ${config.title}`
      )}`
    }
  },
  nextThemes: {
    defaultTheme: 'dark'
  },
}
