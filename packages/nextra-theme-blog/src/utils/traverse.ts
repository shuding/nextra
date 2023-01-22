import type { PageMapItem } from 'nextra'

// BFS traverse the page map tree
export default function traverse(
  pageMap: PageMapItem[],
  matcher: (page: PageMapItem) => boolean | void
): PageMapItem | null {
  for (const pageMapItem of pageMap) {
    if (matcher(pageMapItem)) {
      return pageMapItem
    }
  }

  for (const item of pageMap) {
    if (item.kind === 'Folder') {
      const matched = traverse(item.children, matcher)
      if (matched) {
        return matched
      }
    }
  }
  return null
}
