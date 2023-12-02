import { NEXTRA_INTERNAL } from '../constants.js'
import type { NextraInternalGlobal, Page, PageMapItem } from '../types'
import { isFolder, isMeta, normalizeMeta } from './utils.js'

function getContext(functionName: string): {
  pageMap: PageMapItem[]
  route: string
} {
  const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ]
  if (!__nextra_internal__) {
    throw new Error(
      `Nextra context not found. Make sure you are using "${functionName}" of "nextra/context" on an md/mdx page.`
    )
  }
  return {
    pageMap: __nextra_internal__.pageMap,
    route: __nextra_internal__.route
  }
}

function filter(
  pageMap: PageMapItem[],
  activeLevel?: string
): {
  items: Page[]
  activeLevelPages: Page[]
} {
  let activeLevelPages: Page[] = []
  const items: Page[] = []
  const meta = pageMap.find(isMeta)
  const metaData = meta?.data || {}

  for (const item of pageMap) {
    if (isMeta(item)) continue
    const meta = normalizeMeta(metaData[item.name])
    const page = {
      ...item,
      ...(Object.keys(meta || {}).length > 0 && { meta })
    } as Page

    if (isFolder(page)) {
      const filtered = filter(page.children, activeLevel)
      page.children = filtered.items
      if (filtered.activeLevelPages.length) {
        activeLevelPages = filtered.activeLevelPages
      } else if (page.route === activeLevel) {
        if (!activeLevelPages.length) {
          activeLevelPages = page.children
        }
      }
    }
    items.push(page)
  }

  const metaKeys = Object.keys(metaData)
  items.sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name)
    const indexB = metaKeys.indexOf(b.name)
    if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return { items, activeLevelPages }
}

export function getAllPages(): Page[] {
  const { pageMap } = getContext('getAllPages')
  return filter(pageMap).items
}

export function getCurrentLevelPages(): Page[] {
  const { pageMap, route } = getContext('getCurrentLevelPages')
  return filter(pageMap, route).activeLevelPages
}

export function getPagesUnderRoute(route: string): Page[] {
  const { pageMap } = getContext('getPagesUnderRoute')
  return filter(pageMap, route).activeLevelPages
}
