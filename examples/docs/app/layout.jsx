import { Head, Layout } from 'nextra-theme-docs'

export const viewport = Head.viewport

export const metadata = {
  metadataBase: new URL('https://nextra.site'),
  title: {
    template: '%s - Nextra'
  },
  description: 'Nextra: the Next.js site builder'
}

export default async function RootLayout({ children }) {
  const { pageMap } = await import(
    '../.next/static/chunks/nextra-page-map-.mjs'
  )

  return (
    <html lang="en" dir="ltr">
      <Head />
      <body>
        <Layout
          themeConfig={{}}
          pageOpts={{
            pageMap,
            frontMatter: {},
            timestamp: new Date().getTime()
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
