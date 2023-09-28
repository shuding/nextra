/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import { useRouter } from 'next/router'
import type { FC, ReactElement } from 'react'
import { NEXTRA_INTERNAL } from '../constants.js'
import { normalizePageRoute, pageTitleFromFilename } from '../server/utils.js'
import type {
  DynamicFolder,
  DynamicMeta,
  DynamicMetaDescriptor,
  DynamicMetaItem,
  DynamicMetaJsonFile,
  Folder,
  NextraInternalGlobal,
  PageMapItem,
  PageOpts
} from '../types'
import { DataProvider } from './data.js'

function isFolder(value: DynamicMetaItem): value is DynamicFolder {
  return !!value && typeof value === 'object' && value.type === 'folder'
}

function normalizeMetaData(obj: DynamicMeta): DynamicMeta {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (isFolder(value)) {
        const keyWithoutSlash = key.replace('/', '')
        return [
          keyWithoutSlash,
          value.title || pageTitleFromFilename(keyWithoutSlash)
        ]
      }
      return [key, value || pageTitleFromFilename(key)]
    })
  )
}

export function collectCatchAllRoutes(
  parent: Folder,
  meta: DynamicMetaJsonFile,
  isRootFolder = true
): Folder {
  if (isRootFolder) {
    const folder = collectCatchAllRoutes(parent, meta, false)

    return {
      ...folder,
      children: [{ data: normalizeMetaData(meta.data) }, ...folder.children]
    }
  }
  const result = []

  for (const [key, value] of Object.entries(meta.data)) {
    if (!isFolder(value)) {
      if (key === '*') {
        continue
      }
      result.push({
        name: key,
        route: normalizePageRoute(parent.route, key)
      })
      continue
    }
    const routeWithoutSlashes = key.replace('/', '')
    const newParent: Folder = {
      name: routeWithoutSlashes,
      route: `${parent.route}/${routeWithoutSlashes}`,
      children: [{ data: normalizeMetaData(value.items) }]
    }
    newParent.children.push(
      ...collectCatchAllRoutes(newParent, { data: value.items }, false).children
    )
    result.push(newParent)
  }

  return {
    route: parent.route,
    name: parent.name,
    children: result
  }
}

const cachedResolvedPageMap: Record<string, PageMapItem[]> = Object.create(null)

function findFolder(pageMap: PageMapItem[], [path, ...paths]: string[]): any {
  for (const item of pageMap) {
    if ('children' in item && path === item.name) {
      return paths.length ? findFolder(item.children, paths) : item
    }
  }
}

export const resolvePageMap =
  (locale: string, dynamicMetaModules: DynamicMetaDescriptor) => async () => {
    const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
      NEXTRA_INTERNAL
    ]
    if (
      process.env.NODE_ENV === 'production' &&
      cachedResolvedPageMap[locale]
    ) {
      return cachedResolvedPageMap[locale]
    }
    const { pageMap } = locale
      ? Object.entries(__nextra_internal__.context)
          // Fix race condition. Find a better way to get pageMap?
          .find(([route]) => route.startsWith(`/${locale}/`))![1].pageOpts
      : __nextra_internal__
    const result = await Promise.all(
      Object.entries(dynamicMetaModules).map(async ([route, metaFunction]) => {
        const paths = route.split('/').slice(locale ? 2 : 1)
        const folder = findFolder(pageMap, paths)
        const metaData = await metaFunction()
        return collectCatchAllRoutes(folder, { data: metaData })
      })
    )

    return (cachedResolvedPageMap[locale] = result)
  }

export function setupNextraPage(
  MDXContent: FC,
  useTOC: () => any[],
  route: string,
  pageOpts: PageOpts
) {
  // Make sure the same component is always returned so Next.js will render the
  // stable layout. We then put the actual content into a global store and use
  // the route to identify it.
  const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ]
  __nextra_internal__.route = route
  __nextra_internal__.pageMap = pageOpts.pageMap
  __nextra_internal__.context[route] = {
    Content: MDXContent,
    useTOC,
    pageOpts
  }
  return NextraLayout
}

function NextraLayout({
  __nextra_pageMap = [],
  __nextra_dynamic_opts,
  ...props
}: any): ReactElement {
  const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ]
  const { Layout, themeConfig } = __nextra_internal__
  const { route } = useRouter()
  console.log({ route })

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
  } else {
    pageOpts.toc = pageContext.useTOC()
  }

  const mdxContent = <pageContext.Content />
  return (
    <Layout themeConfig={themeConfig} pageOpts={pageOpts} pageProps={props}>
      <DataProvider value={props}>{mdxContent}</DataProvider>
    </Layout>
  )
}
