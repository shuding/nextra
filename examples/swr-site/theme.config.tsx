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
  head: function useHead() {
    // @ts-expect-error
    const config = useConfig<{ description?: string; image?: string }>() as any
    const { locale } = useRouter() as any
    const image =
      config.frontMatter.image ||
      'https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg'
    const title = `${config.title} | SWR (${locale})`
    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {/* Favicons, meta */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <meta name="msapplication-TileColor" content="#fff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta property="og:image" content={image} />
        <meta name="apple-mobile-web-app-title" content="SWR" />
      </>
    )
  },
  nextThemes: {
    defaultTheme: 'dark'
  },
}

export default config
