import type {
  DynamicFolder,
  DynamicMeta,
  DynamicMetaItem,
  Folder,
  PageMapItem
} from '../../types.js'
import { pageTitleFromFilename } from '../utils.js'

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
      restParent.children = collectCatchAllRoutes(restParent.children, {})
      const prop = meta[restParent.name]
      if (isFolder(prop)) {
        restParent.children.unshift({ data: normalizeMetaData(prop.items) })
      }
      return restParent
    }
    return restParent
  })
}
