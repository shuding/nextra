/* eslint-env node */
import { SwrIcon, VercelIcon } from '@app/_icons'
import type { Metadata } from 'next'
import {
  Footer,
  Head,
  Layout,
  LocaleSwitch,
  Navbar,
  SkipNavLink
} from 'nextra-theme-docs'
import { Banner } from 'nextra/components'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import './styles.css'
import '../_components/features.css'
import { normalizePageMap } from 'nextra/page-map'
import { pageMap as graphqlEslintPageMap } from './remote/graphql-eslint/[[...slug]]/page'
import { pageMap as graphqlYogaPageMap } from './remote/graphql-yoga/[[...slug]]/page'

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

  let { pageMap } = await import(
    `.next/static/chunks/nextra-page-map-${lang}.mjs`
  )

  if (lang === 'en') {
    pageMap = [
      ...pageMap,
      ...normalizePageMap(graphqlEslintPageMap),
      ...normalizePageMap(graphqlYogaPageMap)
    ]
  }

  return (
    <html
      // need to set true RTL language
      lang={lang === 'es' ? 'he' : lang}
      dir={getDirection(lang)}
    >
      <Head
        backgroundColor={{
          dark: '15,23,42',
          light: '254,252,232'
        }}
      />
      <body>
        <Banner storageKey="swr-2">SWR 2.0 is out! Read more →</Banner>
        <SkipNavLink />
        <Layout
          docsRepositoryBase="https://github.com/shuding/nextra/blob/core/examples/swr-site"
          i18n={[
            { locale: 'en', name: 'English' },
            { direction: 'rtl', locale: 'es', name: 'Español RTL' },
            { locale: 'ru', name: 'Русский' }
          ]}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            autoCollapse: true
          }}
          toc={{
            extraContent: (
              <img alt="placeholder cat" src="https://placecats.com/300/200" />
            )
          }}
          editLink={{
            content: dictionary.editPage
          }}
          pageMap={pageMap}
          nextThemes={{
            defaultTheme: 'dark'
          }}
        >
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
          {children}
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
        </Layout>
      </body>
    </html>
  )
}
