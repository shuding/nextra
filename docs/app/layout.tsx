import type { Metadata, Viewport } from 'next'
import { Banner, Footer, Head, Layout, Navbar } from 'nextra-theme-docs'
import type { ReactNode } from 'react'
import './globals.css'
import { NextraLogo, VercelLogo } from '@components/icons'

export const viewport: Viewport = Head.viewport

export const metadata: Metadata = {
  description: 'Make beautiful websites with Next.js & MDX.',
  metadataBase: new URL('https://nextra.site'),
  keywords: [
    'Nextra',
    'Next.js',
    'React',
    'JavaScript',
    'MDX',
    'Markdown',
    'Static Site Generator'
  ],
  generator: 'Next.js',
  applicationName: 'Nextra',
  title: {
    absolute: '',
    template: '%s | Nextra'
  }
}

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  const { pageMap } = await import('.next/static/chunks/nextra-page-map-.mjs')

  return (
    <html lang="en" dir="ltr">
      <Head />
      <body>
        <Layout
          themeConfig={{
            docsRepositoryBase:
              'https://github.com/shuding/nextra/tree/main/docs',
            editLink: {
              content: 'Edit this page on GitHub →'
            },
            sidebar: {
              defaultMenuCollapseLevel: 1
            }
          }}
          banner={
            <Banner storageKey="4.0-release">
              <a href="https://nextra.site" target="_blank" rel="noreferrer">
                🎉 Nextra 4.0 is released. Read more →
              </a>
            </Banner>
          }
          navbar={
            <Navbar
              logo={<NextraLogo className="nextra-logo" />}
              projectLink="https://github.com/shuding/nextra"
            />
          }
          footer={
            <Footer className="flex-col items-center sm:items-start">
              <a
                className="flex items-center gap-1 text-current"
                target="_blank"
                rel="noreferrer"
                title="vercel.com homepage"
                href="https://vercel.com?utm_source=nextra.site"
              >
                <span>Powered by</span>
                <VercelLogo height="20" />
              </a>
              <p className="mt-6 text-xs">
                © {new Date().getFullYear()} The Nextra Project.
              </p>
            </Footer>
          }
          // @ts-expect-error todo: remove it
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
