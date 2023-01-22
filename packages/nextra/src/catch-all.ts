import { MARKDOWN_EXTENSION_REGEX } from './constants'

type Folder = {
  type: 'folder'
  items: DynamicMeta
  title?: string
}

type DynamicMeta = Record<string, string | Folder>

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
    meta[`${name}/`] ||= {} as Folder
    const folder = meta[`${name}/`] as Folder
    folder.items ||= {}

    // fix conflicts when folder and folder with index page exists
    if (Object.hasOwn(meta, name) && typeof folder.title === 'string') {
      if (typeof meta[name] === 'string') {
        meta[name] = folder.title
      } else {
        // @ts-expect-error fix Property 'title' does not exist on type 'string'.
        meta[name].title = folder.title
      }
    }
    addToMap(folder.items, rest)
  }

  return metaMap
}
