import path from 'node:path'
import type {
  DynamicFolder,
  DynamicMeta,
  DynamicMetaItem,
  Folder,
  NextraMetadata,
  PageMapItem
} from '../../types.js'
import { pageTitleFromFilename } from '../utils.js'

function isFolder(value: DynamicMetaItem): value is DynamicFolder {
  return (
    !!value &&
    typeof value === 'object' &&
    'items' in value &&
    // @ts-expect-error -- fixme
    value.type !== 'menu'
  )
}

function normalizeMetaData(
  obj: DynamicMeta,
  map: Record<string, NextraMetadata>
): DynamicMeta {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      let val

      if (isFolder(value)) {
        // Remove `items` object to make zod happy
        const { items: _items, ...rest } = value
        val = rest
      } else {
        val = value
      }
      return [key, map[key] ? val : val || pageTitleFromFilename(key)]
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
      children: mergeMetaWithPageMap(pageMap.children, meta)
    }
  }
  // @ts-expect-error -- pagePath exist
  const result = pageMap.map(({ __pagePath, ...restParent }) => {
    if ('children' in restParent) {
      restParent.children = mergeMetaWithPageMap(
        restParent.children,
        // @ts-expect-error -- fixme
        meta[restParent.name]?.items || {}
      )
      return restParent
    }
    return restParent
  })
  const hasMeta = 'data' in result[0]
  if (hasMeta) {
    // @ts-expect-error fixme
    const childRoute = result[1].route
    const { dir } = path.parse(childRoute)
    const metaPath = `${dir.replace(/^\/$/, '')}/_meta`
    throw new Error(
      [
        'Merging an `_meta.global` file with a folder-specific `_meta` is unsupported.',
        `Move content of \`${metaPath}\` file into the \`_meta.global\` file`
      ].join('\n')
    )
  }
  result.unshift({
    data: normalizeMetaData(
      meta,
      // @ts-expect-error -- fixme
      Object.fromEntries(result.map(key => [key.name, key.frontMatter]))
    )
  })

  // @ts-expect-error -- fixme
  return result
}
