/* eslint-env node */
import type { Metadata } from 'next'
import { Head, Layout, SkipNavLink } from 'nextra-theme-docs'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import './styles.css'

export const { viewport } = Head

export const metadata: Metadata = {}

const locales = new Set(['en', 'es', 'ru'])

export default async function RootLayout({ children, params }) {
  const dictionary = await getDictionary(params.lang)
  const lang = locales.has(params.lang) ? params.lang : 'en'

  const { pageMap } = await import(
    `.next/static/chunks/nextra-page-map-${lang}.mjs`
  )
  console.log('RootLayout', {params, lang})
  return (
    <html lang={lang} dir={getDirection(lang)}>
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
          // navbar={}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
