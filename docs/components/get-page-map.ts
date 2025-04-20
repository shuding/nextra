import { PageMapItem } from 'nextra'
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

export const getEnhancedPageMap: typeof getPageMap = async (...args) => {
  const rootPageMap = await getPageMap(...args)
  const modifiedPageMap = visitPageMap(rootPageMap, item => {
    if ('route' in item) {
      if (item.route === '/api') {
        return {
          ...item,
          children: [
            {
              data: {
                _: {
                  type: 'separator',
                  title: 'Type'
                },
                'nextra-config': '',
                _2: {
                  type: 'separator',
                  title: 'Functions'
                }
              }
            },
            {
              route: '/api',
              name: 'index',
              title: 'Overview'
            },
            ...apiPageMap
          ]
        }
      }
      if (item.route === '/docs/built-ins' && 'children' in item) {
        return {
          ...item,
          children: [...item.children, ...builtInsPageMap]
        }
      }
    }
    return item
  })

  return modifiedPageMap
}
