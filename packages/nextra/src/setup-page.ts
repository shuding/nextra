/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import type { FC } from 'react'
import type {
  DynamicMetaDescriptor,
  Folder,
  NextraInternalGlobal,
  PageOpts,
  ThemeConfig,
  PageMapItem,
  DynamicMetaJsonFile,
  DynamicMeta,
  DynamicMetaItem,
  DynamicFolder
} from './types'
import { normalizePageRoute, pageTitleFromFilename } from './utils'
import NextraLayout from './layout'

import get from 'lodash.get'
import { NEXTRA_INTERNAL } from './constants'

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
    collectCatchAllRoutes(
      parent,
      {
        kind: 'Meta',
        data: meta.data,
        locale: meta.locale
      },
      false
    )
    meta.data = normalizeMetaData(meta.data)
    return
  }
  for (const [key, value] of Object.entries(meta.data)) {
    if (!isFolder(value)) {
      if (key === '*') {
        continue
      }
      parent.children.push({
        kind: 'MdxPage',
        ...(meta.locale && { locale: meta.locale }),
        name: key,
        route: normalizePageRoute(parent.route, key)
      })
      continue
    }
    const routeWithoutSlashes = key.replace('/', '')
    const newParent: Folder = {
      kind: 'Folder',
      name: routeWithoutSlashes,
      route: `${parent.route}/${routeWithoutSlashes}`,
      children: [
        {
          kind: 'Meta',
          ...(meta.locale && { locale: meta.locale }),
          data: normalizeMetaData(value.items)
        }
      ]
    }

    parent.children.push(newParent)
    collectCatchAllRoutes(
      newParent,
      {
        kind: 'Meta',
        data: value.items,
        locale: meta.locale
      },
      false
    )
  }
}

let cachedResolvedPageMap: PageMapItem[]

export function setupNextraPage({
  pageNextRoute,
  pageOpts,
  nextraLayout,
  themeConfig,
  MDXContent,
  hot,
  pageOptsChecksum,
  dynamicMetaModules = []
}: {
  pageNextRoute: string
  pageOpts: PageOpts
  nextraLayout: FC
  themeConfig: ThemeConfig
  MDXContent: FC
  hot?: __WebpackModuleApi.Hot
  pageOptsChecksum?: string
  dynamicMetaModules?: [Promise<any>, DynamicMetaDescriptor][]
}) {
  if (typeof window === 'undefined') {
    globalThis.__nextra_resolvePageMap = async () => {
      if (process.env.NODE_ENV === 'production' && cachedResolvedPageMap) {
        return cachedResolvedPageMap
      }
      const clonedPageMap: PageMapItem[] = JSON.parse(
        JSON.stringify(__nextra_internal__.pageMap)
      )

      await Promise.all(
        dynamicMetaModules.map(
          async ([importMod, { metaObjectKeyPath, metaParentKeyPath }]) => {
            const mod = await importMod
            const metaData = await mod.default()
            const meta: DynamicMetaJsonFile = get(
              clonedPageMap,
              metaObjectKeyPath
            )
            meta.data = metaData

            const parent: Folder = get(clonedPageMap, metaParentKeyPath)
            collectCatchAllRoutes(parent, meta)
          }
        )
      )
      return (cachedResolvedPageMap = clonedPageMap)
    }
  }

  // Make sure the same component is always returned so Next.js will render the
  // stable layout. We then put the actual content into a global store and use
  // the route to identify it.
  const __nextra_internal__ = ((globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ] ||= Object.create(null))

  if (pageOpts.pageMap) {
    __nextra_internal__.pageMap = pageOpts.pageMap
    __nextra_internal__.Layout = nextraLayout
  } else {
    // while using `_app.md/mdx` pageMap will be injected in _app file to boost compilation time,
    // and reduce bundle size
    pageOpts = {
      ...pageOpts,
      pageMap: __nextra_internal__.pageMap,
      flexsearch: __nextra_internal__.flexsearch
    }
    themeConfig = __nextra_internal__.themeConfig
  }

  pageOpts = {
    // @ts-ignore ignore "'frontMatter' is specified more than once" error to treeshake empty object `{}` for each compiled page
    frontMatter: {},
    ...pageOpts
  }

  __nextra_internal__.route = pageOpts.route
  __nextra_internal__.context ||= Object.create(null)
  __nextra_internal__.context[pageNextRoute] = {
    Content: MDXContent,
    pageOpts,
    themeConfig
  }

  if (process.env.NODE_ENV !== 'production' && hot) {
    __nextra_internal__.refreshListeners ||= Object.create(null)
    const checksum = pageOptsChecksum
    hot.data ||= Object.create(null)
    if (hot.data.prevPageOptsChecksum !== checksum) {
      const listeners =
        __nextra_internal__.refreshListeners[pageNextRoute] || []
      for (const listener of listeners) {
        listener()
      }
    }
    hot.dispose(data => {
      data.prevPageOptsChecksum = checksum
    })
  }
  return NextraLayout
}
