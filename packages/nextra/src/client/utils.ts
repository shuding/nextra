import type { Folder, MdxFile, Meta, MetaJsonFile, PageMapItem } from '../types'

export { removeLinks } from './remove-links.js'

export function normalizeMeta(meta: Meta): Exclude<Meta, string> {
  return typeof meta === 'string' ? { title: meta } : meta
}

export function isMeta(item: PageMapItem): item is MetaJsonFile {
  return 'data' in item
}

export function isFolder(item: PageMapItem): item is Folder {
  return 'children' in item
}

export function isMdxFile(item: PageMapItem): item is MdxFile {
  return 'route' in item && !('children' in item)
}
