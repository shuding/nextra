import type {
  DynamicFolder,
  DynamicMeta,
  DynamicMetaItem,
  DynamicMetaJsonFile,
  Folder
} from '../types.js'
import { normalizePageRoute, pageTitleFromFilename } from './utils.js'

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

export function collectCatchAllRoutes(
  parent: Folder,
  meta: DynamicMetaJsonFile,
  isRootFolder = true
): Folder {
  if (isRootFolder) {
    const folder = collectCatchAllRoutes(parent, meta, false)

    return {
      ...folder,
      children: [{ data: normalizeMetaData(meta.data) }, ...folder.children]
    }
  }
  const result = []

  for (const [key, value] of Object.entries(meta.data)) {
    if (!isFolder(value)) {
      if (key === '*') {
        continue
      }
      result.push({
        name: key,
        route: normalizePageRoute(parent.route, key)
      })
      continue
    }
    const routeWithoutSlashes = key.replace('/', '')
    const newParent: Folder = {
      name: routeWithoutSlashes,
      route: `${parent.route}/${routeWithoutSlashes}`,
      children: [{ data: normalizeMetaData(value.items) }]
    }
    newParent.children.push(
      ...collectCatchAllRoutes(newParent, { data: value.items }, false).children
    )
    result.push(newParent)
  }

  return {
    route: parent.route,
    name: parent.name,
    children: result
  }
}
