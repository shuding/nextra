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
      const title = isFolder(value) ? value.title : value
      return [key, title || pageTitleFromFilename(key)]
    })
  )
}

export function mergeMetaWithPageMap<T extends Folder | PageMapItem[]>(
  pageMap: T,
  meta: DynamicMeta
): T {
  if ('children' in pageMap) {
    return {
      ...pageMap,
      children: [
        { data: normalizeMetaData(meta) },
        ...mergeMetaWithPageMap(pageMap.children, meta)
      ]
    }
  }
  // @ts-expect-error -- pagePath exist
  const result = pageMap.map(({ __pagePath, ...restParent }, index, arr) => {
    if ('children' in restParent) {
      restParent.children = mergeMetaWithPageMap(restParent.children, {})
      const prop = meta[restParent.name]
      const hasMeta = 'data' in arr[0]

      if (hasMeta) {
        throw new Error(
          'Merging an `_meta.global` file with a folder-specific `_meta` is unsupported. Move `' +
            restParent.route +
            '/_meta' +
            '` file into the `_meta.global` file'
        )
      }
      if (isFolder(prop)) {
        restParent.children.unshift({ data: normalizeMetaData(prop.items) })
      }
      return restParent
    }
    return restParent
  })
  const hasMeta = 'data' in result[0]

  if (hasMeta) {
    throw new Error(
      'Merging an `_meta.global` file with a folder-specific `_meta` is unsupported. Move `/_meta` ' +
        'file into the `_meta.global` file'
    )
  }
  result.unshift({ data: normalizeMetaData(meta) })

  // @ts-expect-error -- fixme
  return result
}
