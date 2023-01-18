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
  MetaJsonFile
} from './types'
import { normalizePageRoute, pageTitleFromFilename } from './utils'

import get from 'lodash.get'
import { NEXTRA_INTERNAL } from './constants'

function normalizeMetaData(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const keyWithoutSlash = key.replace('/', '')
      return key.includes('/')
        ? [
            keyWithoutSlash,
            value.title || pageTitleFromFilename(keyWithoutSlash)
          ]
        : [key, value || pageTitleFromFilename(key)]
    })
  )
}

export function collectCatchAllRoutes(
  parent: Folder<any>,
  meta: Omit<MetaJsonFile, 'data'> & { data: Record<string, any> },
  isRootFolder = true
) {
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
    const isFolder = key.includes('/')
    if (!isFolder) {
      parent.children.push({
        kind: 'MdxPage',
        locale: meta.locale,
        name: key,
        title: value || pageTitleFromFilename(key),
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
          locale: meta.locale,
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

export function setupNextraPage({
  pageNextRoute,
  pageOpts,
  nextraLayout,
  themeConfig,
  Content,
  hot,
  pageOptsChecksum,
  dynamicMetaModules
}: {
  pageNextRoute: string
  pageOpts: PageOpts
  nextraLayout: FC
  themeConfig: ThemeConfig
  Content: FC
  hot: __WebpackModuleApi.Hot
  pageOptsChecksum: string
  dynamicMetaModules: [Promise<any>, DynamicMetaDescriptor][]
}) {
  if (typeof window === 'undefined') {
    globalThis.__nextra_resolvePageMap = async () => {
      const clonedPageMap = JSON.parse(JSON.stringify(pageOpts.pageMap))

      await Promise.all(
        dynamicMetaModules.map(
          async ([importMod, { metaObjectKeyPath, metaParentKeyPath }]) => {
            const mod = await importMod
            const metaData = await mod.default()
            const meta = get(clonedPageMap, metaObjectKeyPath)
            meta.data = metaData

            const parent = get(
              clonedPageMap,
              metaParentKeyPath.replace(/\.children$/, '')
            )
            collectCatchAllRoutes(parent, meta)
          }
        )
      )
      return clonedPageMap
    }
  }

  // Make sure the same component is always returned so Next.js will render the
  // stable layout. We then put the actual content into a global store and use
  // the route to identify it.
  const __nextra_internal__ = ((globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ] ||= Object.create(null))

  __nextra_internal__.pageMap = pageOpts.pageMap
  __nextra_internal__.route = pageOpts.route
  __nextra_internal__.context ||= Object.create(null)
  __nextra_internal__.refreshListeners ||= Object.create(null)
  __nextra_internal__.Layout = nextraLayout
  __nextra_internal__.context[pageNextRoute] = {
    Content,
    pageOpts,
    themeConfig
  }

  if (process.env.NODE_ENV !== 'production' && hot) {
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
}
