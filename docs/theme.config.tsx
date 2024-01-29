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
      </>
    )
  }
}
