import { NEXTRA_INTERNAL } from '../constants.js'
import type {
  DynamicFolder,
  DynamicMeta,
  DynamicMetaDescriptor,
  DynamicMetaItem,
  DynamicMetaJsonFile,
  Folder,
  NextraInternalGlobal,
  PageMapItem
} from '../types'
import { findFolder } from '../utils.js'
import { normalizePageRoute, pageTitleFromFilename } from './utils.js'

const cachedResolvedPageMap: Record<string, PageMapItem[]> = Object.create(null)

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
