/* eslint-env node */
import { SwrIcon, VercelIcon } from '@app/_icons'
import type { Metadata } from 'next'
import {
  Banner,
  Footer,
  Head,
  Layout,
  LocaleSwitch,
  Navbar,
  SkipNavLink
} from 'nextra-theme-docs'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import './styles.css'
import '../_components/features.css'

export const { viewport } = Head

export const metadata: Metadata = {
  description:
    'SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.',
  title: {
    absolute: '',
    template: '%s | SWR'
  },
  metadataBase: new URL('https://swr.vercel.app'),
  openGraph: {
    images:
      'https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg'
  },
  twitter: {
    site: '@vercel'
  },
  appleWebApp: {
    title: 'SWR'
  },
  other: {
    'msapplication-TileColor': '#fff'
  }
}

export default async function RootLayout({ children, params: { lang } }) {
  const dictionary = await getDictionary(lang)

  const { pageMap } = await import(
    `.next/static/chunks/nextra-page-map-${lang}.mjs`
  )

  return (
    <html
      // need to set true RTL language
      lang={lang === 'es' ? 'he' : lang}
      dir={getDirection(lang)}
    >
      <Head />
      <body>
        <SkipNavLink />
        <Layout
          themeConfig={{
            docsRepositoryBase:
              'https://github.com/shuding/nextra/blob/core/examples/swr-site',
            i18n: [
              { locale: 'en', name: 'English' },
              { direction: 'rtl', locale: 'es', name: 'Español RTL' },
              { locale: 'ru', name: 'Русский' }
            ],
            sidebar: {
              defaultMenuCollapseLevel: 1,
              autoCollapse: true
            },
            toc: {
              extraContent: (
                // eslint-disable-next-line @next/next/no-img-element -- ignore since url is external and dynamic
                <img
                  alt="placeholder cat"
                  src="https://placekitten.com/g/300/200"
                />
              )
            },
            editLink: {
              content: dictionary.editPage
            }
          }}
          // @ts-expect-error fixme
          pageOpts={{
            pageMap,
            frontMatter: {},
            timestamp: new Date().getTime()
          }}
          banner={
            <Banner storageKey="swr-2">SWR 2.0 is out! Read more →</Banner>
          }
          navbar={
            <Navbar
              logo={
                <>
                  <SwrIcon className="h-3" />
                  <span
                    className="max-md:hidden select-none font-extrabold ms-2"
                    title={`SWR: ${dictionary.logo.title}`}
                  >
                    SWR
                  </span>
                </>
              }
              projectLink="https://github.com/vercel/swr"
              chatLink="https://discord.com"
            >
              <LocaleSwitch className="[&>span>span]:hidden" />
            </Navbar>
          }
          footer={
            <Footer>
              <a
                rel="noreferrer"
                target="_blank"
                className="flex items-center gap-2 font-semibold"
                href={dictionary.link.vercel}
              >
                {dictionary.poweredBy} <VercelIcon />
              </a>
            </Footer>
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
