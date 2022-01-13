import { PageMapItem } from 'nextra'

// BFS traverse the page map tree
export default function traverse(
  pageMap: PageMapItem[],
  matcher: (page: PageMapItem) => boolean | void
): PageMapItem | null {
  for (let i = 0; i < pageMap.length; i++) {
    if (matcher(pageMap[i])) {
      return pageMap[i]
    }
  }
  for (let i = 0; i < pageMap.length; i++) {
    const { children } = pageMap[i]
    if (children) {
      const matched = traverse(children, matcher)
      if (matched) {
        return matched
      }
    }
  }
  return null
}
