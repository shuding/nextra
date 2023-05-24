import { MARKDOWN_EXTENSION_REGEX } from './constants'
import type { DynamicFolder, DynamicMeta } from './types'

function appendSlashForFolders(obj: DynamicMeta): DynamicMeta {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const isFolder =
        value && typeof value === 'object' && value.type === 'folder'
      return isFolder ? [`${key}/`, value] : [key, value]
    })
  )
}

export function createCatchAllMeta(
  filePaths: string[],
  customMeta: DynamicMeta = Object.create(null)
): DynamicMeta {
  const metaMap: DynamicMeta = appendSlashForFolders(customMeta)

  const paths = filePaths
    .filter(filePath => MARKDOWN_EXTENSION_REGEX.test(filePath))
    .map(filePath => filePath.replace(MARKDOWN_EXTENSION_REGEX, '').split('/'))

  for (const path of paths) {
    addToMap(metaMap, path)
  }

  function addToMap(meta: DynamicMeta, path: string[]) {
    const isPage = path.length === 1
    const [name, ...rest] = path
    if (isPage) {
      meta[name] ||= ''
      return
    }
    meta[`${name}/`] ||= {} as DynamicFolder
    const folder = meta[`${name}/`] as DynamicFolder
    folder.items ||= {}
    folder.type ||= 'folder'

    // fix conflicts when folder and folder with index page exists
    if (Object.hasOwn(meta, name) && typeof folder.title === 'string') {
      const metaItem = meta[name]
      if (typeof metaItem === 'string') {
        meta[name] = folder.title
      } else {
        metaItem.title = folder.title
      }
    }
    addToMap(folder.items, rest)
  }

  return metaMap
}
