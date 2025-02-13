import path from 'node:path'
import type {
  $NextraMetadata,
  DynamicFolder,
  DynamicMeta,
  DynamicMetaItem,
  Folder,
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

function normalizeMetaRecord(
  obj: DynamicMeta,
  map: Record<string, $NextraMetadata>
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
  meta: DynamicMeta,
  shouldCheckIndividualMetaFilesUsage = false
): T {
  if ('children' in pageMap) {
    return {
      ...pageMap,
      children: mergeMetaWithPageMap(
        pageMap.children,
        meta,
        shouldCheckIndividualMetaFilesUsage
      )
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
  const normalizedMetaRecord = normalizeMetaRecord(
    meta,
    // @ts-expect-error -- fixme
    Object.fromEntries(result.map(key => [key.name, key.frontMatter]))
  )
  const metaRecord = result[0] && 'data' in result[0] && result[0].data
  if (metaRecord) {
    if (shouldCheckIndividualMetaFilesUsage) {
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
    Object.assign(metaRecord, normalizedMetaRecord)
  } else {
    result.unshift({ data: normalizedMetaRecord })
  }

  // @ts-expect-error -- fixme
  return result
}
