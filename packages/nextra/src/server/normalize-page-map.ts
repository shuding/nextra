import type { Folder, FrontMatter, MdxFile, PageMapItem } from '../types'

export function normalizePageMap(pageMap: PageMapItem[] | Folder): any {
  if (Array.isArray(pageMap)) {
    return sortFolder(
      pageMap.map(item => ('children' in item ? normalizePageMap(item) : item))
    )
  }
  return sortFolder(pageMap)
}

type ParsedFolder = Folder & {
  frontMatter: FrontMatter
  withIndexPage?: true
}

function sortFolder(pageMap: PageMapItem[] | Folder) {
  const newChildren: (Folder | MdxFile)[] = []

  const isFolder = !Array.isArray(pageMap)

  const folder = (
    isFolder ? { ...pageMap } : { children: pageMap }
  ) as ParsedFolder

  const meta: Record<string, Record<string, any>> = {}

  for (const item of folder.children) {
    if (
      isFolder &&
      'frontMatter' in item &&
      item.frontMatter?.asIndexPage &&
      item.route === folder.route
    ) {
      folder.frontMatter = item.frontMatter
      folder.withIndexPage = true
    } else if ('children' in item) {
      newChildren.push(normalizePageMap(item))
    } else if ('data' in item) {
      for (const [key, titleOrObject] of Object.entries(item.data)) {
        meta[key] =
          typeof titleOrObject === 'string'
            ? { title: titleOrObject }
            : titleOrObject
        if (key === '*') {
          delete meta['*'].title
          delete meta['*'].href
        }
      }
    } else {
      newChildren.push(item)
    }
  }

  const metaKeys = Object.keys(meta || {})
  let metaKeyIndex = -1

  const children = newChildren
    .sort((a, b) => {
      const indexA = metaKeys.indexOf(a.name)
      const indexB = metaKeys.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    .flatMap(item => {
      const items = []
      const index = metaKeys.indexOf(item.name)
      let extendedItem
      if (index !== -1) {
        // Fill all skipped items in meta.
        for (let i = metaKeyIndex + 1; i < index; i++) {
          const key = metaKeys[i]
          if (key === '*') continue
          const value = meta[key]
          const isValid = value.type === 'separator' || value.href

          if (!isValid) {
            throw new Error(
              `Field key "${key}" in \`_meta\` file points to nothing, remove him`
            )
          }
          items.push({ name: key, ...value })
        }
        metaKeyIndex = index
        extendedItem = { ...meta[item.name], ...item }
        // @ts-expect-error
        delete extendedItem.type
        // @ts-expect-error
        delete extendedItem.theme
      }
      items.push(extendedItem || item)
      return items
    })

  // Fill all skipped items in meta.
  for (let i = metaKeyIndex + 1; i < metaKeys.length; i++) {
    const key = metaKeys[i]
    const value = meta[key]
    if (key === '*') continue
    const isValid =
      value.type === 'separator' || value.href || value.type === 'menu'

    if (!isValid) {
      throw new Error(
        `Field key "${key}" in \`_meta\` file points to nothing, remove him`
      )
    }
    children.push({ name: key, ...value } as MdxFile)
  }

  if (metaKeys.length) {
    // @ts-expect-error
    children.unshift({ data: meta })
  }

  return isFolder ? { ...folder, children } : children
}
