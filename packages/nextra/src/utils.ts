import type { PageMapItem } from './types'

export function findFolder(
  pageMap: PageMapItem[],
  [path, ...paths]: string[]
): any {
  for (const item of pageMap) {
    if ('children' in item && path === item.name) {
      return paths.length ? findFolder(item.children, paths) : item
    }
  }
}

export function clonePageMap(pageMap: PageMapItem[]): PageMapItem[] {
  return pageMap.map(item => {
    return 'children' in item
      ? { ...item, children: clonePageMap(item.children) }
      : item
  })
}
