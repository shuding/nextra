/* eslint sort-keys: error */
import { useRouter } from 'next/navigation'
import { LocaleSwitch, useConfig } from 'nextra-theme-docs'

const Vercel = () => (
  <svg height="20" viewBox="0 0 283 64" fill="none">
    <path
      fill="currentColor"
      d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
    />
  </svg>
)

const EDIT_TEXT = {
  en: 'Edit this page on GitHub →',
  es: 'Edite esta página en GitHub',
  ru: 'Редактировать на GitHub'
}

const FOOTER_LINK = {
  en: 'https://vercel.com/?utm_source=swr',
  es: 'https://vercel.com/?utm_source=swr_es-es',
  ru: 'https://vercel.com/?utm_source=swr_ru'
}

const FOOTER_LINK_TEXT = {
  en: (
    <>
      Powered by
      <Vercel />
    </>
  ),
  es: (
    <>
      Desarrollado por
      <Vercel />
    </>
  ),
  ru: (
    <>
      Работает на
      <Vercel />
    </>
  )
}

const config = {
  banner: {
    content: 'SWR 2.0 is out! Read more →',
    key: 'swr-2'
  },
  // chat: {
  //   link: 'https://discord.com'
  // },
  darkMode: true,
  docsRepositoryBase:
    'https://github.com/shuding/nextra/blob/core/examples/swr-site',
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
  footer: {
    content: function useText() {
      // @ts-expect-error
      const { locale } = useRouter()
      return (
        <a
          rel="noreferrer"
          target="_blank"
          className="flex items-center gap-2 font-semibold"
          href={FOOTER_LINK[locale!]}
        >
          {FOOTER_LINK_TEXT[locale!]}
        </a>
      )
    }
  },
  head: function useHead() {
    // @ts-expect-error
    const config = useConfig<{ description?: string; image?: string }>() as any
    const { locale } = useRouter() as any
    const description =
      config.frontMatter.description ||
      'SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.'
    const image =
      config.frontMatter.image ||
      'https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg'
    const title = `${config.title} | SWR (${locale})`
    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
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
  i18n: [
    { locale: 'en', name: 'English' },
    { direction: 'rtl', locale: 'es', name: 'Español RTL' },
    { locale: 'ru', name: 'Русский' }
  ],
  navbar: {
    extraContent: LocaleSwitch
  },
  nextThemes: {
    defaultTheme: 'dark'
  },
  project: {
    link: 'https://github.com/vercel/swr'
  },
  sidebar: {
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    extraContent: (
      // eslint-disable-next-line @next/next/no-img-element -- ignore since url is external and dynamic
      <img alt="placeholder cat" src="https://placekitten.com/g/300/200" />
    ),
    float: true
  }
}

export default config
