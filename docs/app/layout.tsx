import { NextraLogo, VercelLogo } from '@components/icons'
import cn from 'clsx'
import type { Metadata } from 'next'
import { Footer, Layout, Navbar, Link } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import './globals.css'

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
  openGraph: {
    url: 'https://nextra.site',
    siteName: 'Nextra',
    locale: 'en_US',
    type: 'website'
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

const RootLayout: FC<{
  children: ReactNode
}> = async ({ children }) => {
  const banner = (
    <Banner dismissible={false}>
      🚧 This is WIP documentation for Nextra 4.0. Dima Machina is looking <Link href='mailto:dmytropostolov@gmail.com'>for a new job or consulting</Link>.
    </Banner>
  )
  const navbar = (
    <Navbar
      logo={
        <NextraLogo
          height="20"
          className={cn(
            '[mask-image:linear-gradient(60deg,#000_25%,rgba(0,0,0,.2)_50%,#000_75%)] [mask-position:0] [mask-size:400%]',
            'hover:[mask-position:100%] hover:[transition:mask-position_1s_ease]'
          )}
        />
      }
      projectLink="https://github.com/shuding/nextra"
    />
  )
  const footer = (
    <Footer className="flex-col items-center md:items-start">
      <a
        className="x:focus-visible:nextra-focus flex items-center gap-1"
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
  )
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

export default RootLayout
