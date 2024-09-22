import type { Metadata, Viewport } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
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
  appleWebApp: {
    title: 'Nextra'
  },
  title: {
    absolute: '',
    template: '%s | Nextra'
  },
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-dark.svg',
        type: 'image/svg+xml'
      },
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon.svg',
        type: 'image/svg+xml'
      }
    ]
  },
  other: {
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://nextra.site'
  }
}

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  const { pageMap } = await import('.next/static/chunks/nextra-page-map-.mjs')

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          editLink={{ content: 'Edit this page on GitHub →' }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          <Banner storageKey="4.0-release">
            <a
              href="https://nextra.site"
              target="_blank"
              rel="noreferrer"
              className="nextra-focus"
            >
              🎉 Nextra 4.0 is released. Read more →
            </a>
          </Banner>
          <Navbar
            logo={<NextraLogo className="nextra-logo h-5" />}
            projectLink="https://github.com/shuding/nextra"
          />
          {children}
          <Footer className="flex-col items-center sm:items-start">
            <a
              className="nextra-focus flex items-center gap-1"
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
        </Layout>
      </body>
    </html>
  )
}
