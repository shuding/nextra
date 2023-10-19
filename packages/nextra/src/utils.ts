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
