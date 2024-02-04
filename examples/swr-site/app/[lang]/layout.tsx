/* eslint-env node */
import type { Metadata } from 'next'
import { Head, Layout, Navbar, SkipNavLink } from 'nextra-theme-docs'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import { default as SwrIcon } from '../_icons/swr.svg'
import './styles.css'
import '../_components/features.css'

export const { viewport } = Head

export const metadata: Metadata = {}

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
          themeConfig={{}}
          // @ts-expect-error fixme
          pageOpts={{
            pageMap,
            frontMatter: {},
            timestamp: new Date().getTime()
          }}
          // banner={}
          navbar={
            <Navbar
              logo={
                <>
                  <SwrIcon className="h-3" />
                  <span
                    className="max-md:hidden select-none font-extrabold ltr:ml-2 rtl:mr-2"
                    title={`SWR: ${dictionary.logo.title}`}
                  >
                    SWR
                  </span>
                </>
              }
            />
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
