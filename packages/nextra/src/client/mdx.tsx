import { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import type { Components } from '@mdx-js/react/lib'
import Image, { type ImageProps } from 'next/image'
import { useRouter } from 'next/router'
import { createElement } from 'react'
import { NEXTRA_INTERNAL } from '../constants.js'
import type { NextraInternalGlobal } from '../types'
import { DataProvider } from './data.js'
import { findFolder } from './utils.js'

const DEFAULT_COMPONENTS = {
  img: props =>
    createElement(
      typeof props.src === 'object' ? Image : 'img',
      props as ImageProps
    ),
  wrapper: function NextraLayout({
    __nextra_pageMap = [],
    __nextra_dynamic_opts,
    children,
    toc,
    ...props
  }) {
    const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
      NEXTRA_INTERNAL
    ]
    const { Layout, themeConfig } = __nextra_internal__
    const { route } = useRouter()

    const pageContext = __nextra_internal__.context[route]

    if (!pageContext) {
      throw new Error(
        `No content found for the "${route}" route. Please report it as a bug.`
      )
    }

    let { pageOpts } = pageContext

    for (const { route, children } of __nextra_pageMap) {
      // TODO 2 for locale, 1 without local
      const paths = route.split('/').slice(2)
      const folder = findFolder(pageOpts.pageMap, paths)
      folder.children = children
    }

    if (__nextra_dynamic_opts) {
      const { toc, title, frontMatter } = __nextra_dynamic_opts
      pageOpts = {
        ...pageOpts,
        toc,
        title,
        frontMatter
      }
    }

    pageOpts.toc = toc

    return (
      <Layout themeConfig={themeConfig} pageOpts={pageOpts} pageProps={props}>
        <DataProvider value={props}>{children}</DataProvider>
      </Layout>
    )
  }
} satisfies Components

export const useMDXComponents: typeof originalUseMDXComponents = components => {
  return originalUseMDXComponents({
    ...DEFAULT_COMPONENTS,
    ...components
  })
}

export { MDXProvider } from '@mdx-js/react'

export type { Components }
