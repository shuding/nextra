/* eslint-env node */
import { Banner, Head, Layout, Navbar } from 'nextra-theme-docs'

export const { viewport } = Head

export const metadata = {
  metadataBase: new URL('https://nextra.site'),
  title: {
    template: '%s - Nextra'
  },
  description: 'Nextra: the Next.js site builder',
  applicationName: 'Nextra',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Nextra'
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://nextra.site'
  }
}

export default async function RootLayout({ children }) {
  const { pageMap } = await import(
    '../.next/static/chunks/nextra-page-map-.mjs'
  )

  return (
    <html lang="en" dir="ltr">
      <Head
      // faviconGlyph="✦"
      />
      <body>
        <Layout
          themeConfig={{
            editLink: {
              content: 'Edit this page on GitHub'
            },
            docsRepositoryBase:
              'https://github.com/shuding/nextra/blob/core/examples/docs',
            sidebar: {
              defaultMenuCollapseLevel: 1
            }
          }}
          pageOpts={{
            pageMap,
            frontMatter: {},
            timestamp: new Date().getTime()
          }}
          banner={<Banner storageKey="Nextra 2">Nextra 2 Alpha</Banner>}
          navbar={
            <Navbar
              // Next.js discord server
              chatLink="https://discord.gg/hEM84NMkRv"
            />
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
