import { usePathname } from 'next/navigation'

const config = {
  head: function useHead() {
    const pathname = usePathname()
    const pageTitle = ''
    const image =
      'https://nextra.site/' +
      (pathname === '/' ? 'og.jpeg' : `api/og?title=${pageTitle}`)

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="apple-mobile-web-app-title" content="Nextra" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    )
  }
}
