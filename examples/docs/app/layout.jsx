import { Head } from 'nextra-theme-docs'

export const viewport = Head.viewport

export const metadata = {}

export default async function Layout({ children }) {
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
