/* eslint-env node */
import { SwrIcon, VercelIcon } from '@app/_icons'
import type { Metadata } from 'next'
import {
  Footer,
  LastUpdated,
  Layout,
  Link,
  LocaleSwitch,
  Navbar
} from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import { pageMap as graphqlEslintPageMap } from './graphql-eslint/[[...slug]]/page'
import { pageMap as graphqlYogaPageMap } from './remote/graphql-yoga/[[...slug]]/page'
import './styles.css'

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

type LayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{
    lang: string
  }>
}>

const RootLayout: FC<LayoutProps> = async ({ children, params }) => {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  let pageMap = await getPageMap(`/${lang}`)

  if (lang === 'en') {
    pageMap = [
      ...pageMap,
      {
        name: 'remote',
        route: '/remote',
        children: [graphqlYogaPageMap],
        title: 'Remote'
      },
      graphqlEslintPageMap
    ]
  }
  const banner = (
    <Banner storageKey="swr-2">
      SWR 2.0 is out! <Link href="#">Read more →</Link>
    </Banner>
  )
  const navbar = (
    <Navbar
      logo={
        <>
          <SwrIcon height="12" />
          <span
            className="ms-2 select-none font-extrabold max-md:hidden"
            title={`SWR: ${dictionary.logo.title}`}
          >
            SWR
          </span>
        </>
      }
      projectLink="https://github.com/vercel/swr"
      chatLink="https://discord.com"
    >
      <LocaleSwitch lite />
    </Navbar>
  )
  const footer = (
    <Footer>
      <a
        rel="noreferrer"
        target="_blank"
        className="x:focus-visible:nextra-focus flex items-center gap-2 font-semibold"
        href={dictionary.link.vercel}
      >
        {dictionary.poweredBy} <VercelIcon height="20" />
      </a>
    </Footer>
  )
  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <Head
        backgroundColor={{
          dark: 'rgb(15,23,42)',
          light: 'rgb(254, 252, 232)'
        }}
        color={{
          hue: { dark: 120, light: 0 },
          saturation: { dark: 100, light: 100 }
        }}
      />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          footer={footer}
          docsRepositoryBase="https://github.com/shuding/nextra/blob/main/examples/swr-site"
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'es', name: 'Español RTL' },
            { locale: 'ru', name: 'Русский' }
          ]}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            autoCollapse: true
          }}
          toc={{
            backToTop: dictionary.backToTop,
            extraContent: (
              // eslint-disable-next-line @next/next/no-img-element -- we can't use with external urls
              <img alt="placeholder cat" src="https://placecats.com/300/200" />
            )
          }}
          editLink={dictionary.editPage}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: 'dark' }}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
          themeSwitch={{
            dark: dictionary.dark,
            light: dictionary.light,
            system: dictionary.system
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

export default RootLayout
