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
  parent: Folder<any>,
  meta: DynamicMetaJsonFile,
  isRootFolder = true
): void {
  if (isRootFolder) {
    collectCatchAllRoutes(parent, { data: meta.data }, false)
    meta.data = normalizeMetaData(meta.data)
    return
  }
  for (const [key, value] of Object.entries(meta.data)) {
    if (!isFolder(value)) {
      if (key === '*') {
        continue
      }
      parent.children.push({
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

    parent.children.push(newParent)
    collectCatchAllRoutes(newParent, { data: value.items }, false)
  }
}

let cachedResolvedPageMap: PageMapItem[]

function findFolder(pageMap: PageMapItem[], [path, ...paths]: string[]): any {
  for (const item of pageMap) {
    if ('children' in item && path === item.name) {
      return paths.length ? findFolder(item.children, paths) : item
    }
  }
}

export const resolvePageMap =
  (dynamicMetaModules: DynamicMetaDescriptor) => async () => {
    const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
      NEXTRA_INTERNAL
    ]
    if (process.env.NODE_ENV === 'production' && cachedResolvedPageMap) {
      return cachedResolvedPageMap
    }
    const clonedPageMap = structuredClone(__nextra_internal__.pageMap)

    for (const [route, metaFunction] of Object.entries(dynamicMetaModules)) {
      // TODO 2 for locale, 1 without local
      const folder = findFolder(clonedPageMap, route.split('/').slice(2))
      const metaData = await metaFunction()
      const meta: DynamicMetaJsonFile = folder.children[0]
      meta.data = metaData
      collectCatchAllRoutes(folder, meta)
    }
    // TODO: found workaround to fix Reason: `symbol` cannot be serialized as JSON. Please only
    //  return JSON serializable data types.
    return (cachedResolvedPageMap = clonedPageMap)
  }

export function setupNextraPage(
  MDXContent: FC,
  route: string,
  { pageOpts }: { pageOpts: PageOpts }
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
    pageOpts
  }
  return NextraLayout
}

function NextraLayout({
  __nextra_pageMap,
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
  const { Content } = pageContext

  if (__nextra_pageMap) {
    pageOpts = {
      ...pageOpts,
      pageMap: __nextra_pageMap
    }
  }

  if (__nextra_dynamic_opts) {
    const { headings, title, frontMatter } = JSON.parse(__nextra_dynamic_opts)
    pageOpts = {
      ...pageOpts,
      headings,
      title,
      frontMatter
    }
  }
  return (
    <Layout themeConfig={themeConfig} pageOpts={pageOpts} pageProps={props}>
      <DataProvider value={props}>
        <Content />
      </DataProvider>
    </Layout>
  )
}
