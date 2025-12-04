import { getEnhancedPageMap } from '@components/get-page-map'
import { NextraLogo, VercelLogo } from '@components/icons'
import { ChatButton } from '@components/inkeep-chat-button'
import cn from 'clsx'
import type { Metadata } from 'next'
import NextImage from 'next/image'
import { Footer, Layout, Link, Navbar } from 'nextra-theme-docs'
import { Anchor, Banner, Head } from 'nextra/components'
import type { FC } from 'react'
import inkeep from './showcase/_logos/inkeep.png'
import xyflow from './showcase/_logos/xyflow.png'
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
    default: 'Nextra – Next.js Static Site Generator',
    template: '%s | Nextra'
  },
  openGraph: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    url: './',
    siteName: 'Nextra',
    locale: 'en_US',
    type: 'website'
  },
  other: {
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://nextra.site'
  },
  alternates: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    canonical: './'
  }
}

const banner = (
  <Banner>
    🎉 Nextra 4.0 has been released.{' '}
    <Link href="https://the-guild.dev/blog/nextra-4" className="text-current!">
      Read blogpost
    </Link>
  </Banner>
)
const navbar = (
  <Navbar
    logo={
      <NextraLogo
        height="20"
        className={cn(
          'hover:transition-all hover:duration-1000 motion-reduce:hover:transition-none',
          '[mask-image:linear-gradient(60deg,#000_25%,rgba(0,0,0,.2)_50%,#000_75%)] [mask-size:400%] [mask-position:0]',
          'hover:[mask-position:100%]'
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

const RootLayout: FC<LayoutProps<'/'>> = async ({ children }) => {
  const pageMap = await getEnhancedPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <ChatButton />
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          footer={footer}
          toc={{
            extraContent: (
              <>
                <b className="mt-2 text-xs">Sponsored by:</b>
                {[
                  {
                    url: 'https://inkeep.com',
                    alt: 'AI Agents that get real work done',
                    img: inkeep
                  },
                  {
                    url: 'https://xyflow.com',
                    alt: 'Wire your ideas with xyflow!',
                    img: xyflow
                  }
                ].map(o => (
                  <Anchor
                    key={o.url}
                    href={`${o.url}?utm_source=nextra.site&utm_campaign=nextra&utm_content=sidebarLink`}
                  >
                    <NextImage
                      src={o.img}
                      title={o.alt}
                      alt={o.alt}
                      className="nextra-border rounded-sm border"
                    />
                  </Anchor>
                ))}
              </>
            )
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

export default RootLayout
