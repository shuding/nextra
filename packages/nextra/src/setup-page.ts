/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import get from 'lodash.get'
import type { FC } from 'react'
import { NEXTRA_INTERNAL } from './constants'
import NextraLayout from './layout'
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
} from './types'
import { normalizePageRoute, pageTitleFromFilename } from './utils'

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
        data: meta.data
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
          data: normalizeMetaData(value.items)
        }
      ]
    }

    parent.children.push(newParent)
    collectCatchAllRoutes(
      newParent,
      {
        kind: 'Meta',
        data: value.items
      },
      false
    )
  }
}

let cachedResolvedPageMap: PageMapItem[]

export function setupNextraPage({
  pageOpts,
  MDXContent,
  dynamicMetaModules = [],
  route
}: {
  pageOpts: PageOpts
  MDXContent: FC
  dynamicMetaModules?: [() => any, DynamicMetaDescriptor][]
  route: string
}) {
  if (typeof window === 'undefined') {
    globalThis.__nextra_resolvePageMap = async () => {
      if (process.env.NODE_ENV === 'production' && cachedResolvedPageMap) {
        return cachedResolvedPageMap
      }
      const clonedPageMap = structuredClone(__nextra_internal__.pageMap)
      for (const [
        metaFunction,
        { metaObjectKeyPath, metaParentKeyPath }
      ] of dynamicMetaModules) {
        const metaData = await metaFunction()
        const meta: DynamicMetaJsonFile = get(clonedPageMap, metaObjectKeyPath)
        meta.data = metaData
        const parent: Folder = get(clonedPageMap, metaParentKeyPath)
        collectCatchAllRoutes(parent, meta)
      }
      return (cachedResolvedPageMap = clonedPageMap)
    }
  }

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
