/* eslint sort-keys: error */
import { useRouter } from 'next/navigation'
import { useConfig } from 'nextra-theme-docs'

const EDIT_TEXT = {
  en: 'Edit this page on GitHub →',
  es: 'Edite esta página en GitHub',
  ru: 'Редактировать на GitHub'
}

const config = {
  editLink: {
    content: function useText() {
      // @ts-expect-error
      const { locale } = useRouter()
      return EDIT_TEXT[locale!]
    }
  },
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
