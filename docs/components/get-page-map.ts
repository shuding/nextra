import type { MetaJsonFile, PageMapItem } from 'nextra'
import { getPageMap } from 'nextra/page-map'
import { pageMap as apiPageMap } from '../app/api/[name]/page'
import { pageMap as builtInsPageMap } from '../app/docs/built-ins/[name]/page'

type PageMapVisitor = (item: PageMapItem) => PageMapItem

function visitPageMap(
  pageMap: PageMapItem,
  visitor: PageMapVisitor
): PageMapItem
function visitPageMap(
  pageMap: PageMapItem[],
  visitor: PageMapVisitor
): PageMapItem[]
function visitPageMap(
  pageMap: PageMapItem[] | PageMapItem,
  visitor: PageMapVisitor
): PageMapItem[] | PageMapItem {
  if (Array.isArray(pageMap)) {
    return pageMap.map(item => visitPageMap(item, visitor))
  }
  if ('children' in pageMap) {
    return visitor({
      ...pageMap,
      children: visitPageMap(pageMap.children, visitor)
    })
  }
  return visitor(pageMap)
}

function createMetaItem(pageMap: typeof apiPageMap): MetaJsonFile {
  return {
    data: Object.fromEntries(
      pageMap.map(o => {
        if ('type' in o && o.type === 'separator') {
          return [o.name, { type: 'separator', title: o.title }]
        }
        return [o.name, '']
      })
    )
  }
}

export const getEnhancedPageMap: typeof getPageMap = async (...args) => {
  const rootPageMap = await getPageMap(...args)
  const modifiedPageMap = visitPageMap(rootPageMap, item => {
    if ('route' in item) {
      if (item.route === '/api') {
        return {
          ...item,
          children: [
            createMetaItem(apiPageMap),
            {
              route: '/api',
              name: 'index',
              title: 'Overview'
            },
            ...apiPageMap
          ]
        }
      }
      if (item.route === '/docs/built-ins') {
        return {
          ...item,
          children: [createMetaItem(builtInsPageMap), ...builtInsPageMap]
        }
      }
    }
    return item
  })

  return modifiedPageMap
}
