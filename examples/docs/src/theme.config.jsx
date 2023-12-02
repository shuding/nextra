import { useConfig } from 'nextra-theme-docs'

/* eslint sort-keys: error */
/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
export default {
  banner: {
    content: 'Nextra 2 Alpha',
    key: 'Nextra 2'
  },
  chat: {
    link: 'https://discord.gg/hEM84NMkRv' // Next.js discord server,
  },
  docsRepositoryBase:
    'https://github.com/shuding/nextra/blob/core/examples/docs',
  editLink: {
    content: 'Edit this page on GitHub'
  },
  faviconGlyph: '✦',
  head: function useHead() {
    const config = useConfig()
    const title = `${config.title} – Nextra`
    const description =
      config.frontMatter.description || 'Nextra: the Next.js site builder'
    const image = config.frontMatter.image || 'https://nextra.site/og.jpeg'
    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="og:image" content={image} />

        <meta name="msapplication-TileColor" content="#fff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="apple-mobile-web-app-title" content="Nextra" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://nextra.site" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </>
    )
  }
}
