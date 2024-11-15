import type {
  DynamicFolder,
  DynamicMeta,
  DynamicMetaItem,
  DynamicMetaJsonFile,
  Folder,
  PageMapItem
} from '../../types.js'
import { normalizePageRoute, pageTitleFromFilename } from '../utils.js'

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

export function collectCatchAllRoutes<T extends Folder | PageMapItem[]>(
  parent: T,
  meta: DynamicMeta
): T {
  if ('children' in parent) {
    return {
      ...parent,
      children: [
        { data: normalizeMetaData(meta) },
        ...collectCatchAllRoutes(parent.children, meta)
      ]
    }
  }
  // @ts-expect-error -- pagePath exist
  return parent.map(({ __pagePath, ...restParent }) => {
    if ('children' in restParent) {
      const prop = meta[restParent.name]

      return {
        ...restParent,
        children: [
          ...(isFolder(prop) ? [{ data: normalizeMetaData(prop.items) }] : []),
          ...collectCatchAllRoutes(restParent.children, {})
        ]
      }
    }
    return restParent
  })
}
