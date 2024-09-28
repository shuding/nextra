import { NextraLogo, VercelLogo } from '@components/icons'
import type { Metadata, Viewport } from 'next'
import { Footer, Layout, Link, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import type { ReactNode } from 'react'
import './globals.css'
import cn from 'clsx'

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
          editLink="Edit this page on GitHub →"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          <Banner storageKey="4.0-release">
            <div className='before:content-["🎉_"]'>
              <Link
                href="https://the-guild.dev/blog/nextra-3"
                className='after:content-["_→"]'
              >
                Nextra 4.0 is released. Read more
              </Link>
            </div>
          </Banner>
          <Navbar
            logo={
              <NextraLogo
                height="20"
                className={cn(
                  '[mask-position:0] [mask-size:400%] [mask-image:linear-gradient(60deg,#000_25%,rgba(0,0,0,.2)_50%,#000_75%)]',
                  'hover:[mask-position:100%] hover:[transition:mask-position_1s_ease]'
                )}
              />
            }
            projectLink="https://github.com/shuding/nextra"
          />
          {children}
          <Footer className="flex-col items-center md:items-start">
            <a
              className="focus-visible:nextra-focus flex items-center gap-1"
              target="_blank"
              rel="noreferrer"
              title="vercel.com homepage"
              href="https://vercel.com?utm_source=nextra.site"
            >
              Powered by
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
