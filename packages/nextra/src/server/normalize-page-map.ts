import type {
  Folder,
  FrontMatter,
  MdxFile,
  MetaJsonFile,
  PageMapItem
} from '../types'

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

  for (const [index, item] of folder.children.entries()) {
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
      const prevItem = folder.children[index - 1] as Exclude<
        PageMapItem,
        MetaJsonFile
      >
      // If there are two items with the same name, they must be a directory and a
      // page. In that case we merge them, and use the page's link.
      if (prevItem && prevItem.name === item.name) {
        newChildren[newChildren.length - 1] = {
          ...prevItem,
          // @ts-expect-error fixme
          withIndexPage: true,
          frontMatter: item.frontMatter
        }
        continue
      }
      newChildren.push(item)
    }
  }

  const metaKeys = Object.keys(meta)

  // Normalize items based on files and _meta.json.
  const items = newChildren.toSorted((a, b) => {
    const indexA = metaKeys.indexOf(a.name)
    const indexB = metaKeys.indexOf(b.name)
    if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  for (const [index, metaKey] of metaKeys
    .filter(key => key !== '*')
    .entries()) {
    const metaItem = meta[metaKey]
    const item = items.find(item => item.name === metaKey)
    if (metaItem.type === 'menu') {
      if (item) {
        // @ts-expect-error fixme
        item.items = metaItem.items

        // Validate menu items, local page should exist
        const { children } = items.find(
          (i): i is Folder<MdxFile> => i.name === metaKey
        )!
        for (const [key, value] of Object.entries(
          // @ts-expect-error fixme
          item.items as Record<string, { title: string; href?: string }>
        )) {
          if (!value.href && children.every(i => i.name !== key)) {
            throw new Error(
              `Validation of "_meta" file has failed.
The field key "${metaKey}.items.${key}" in \`_meta\` file refers to a page that cannot be found, remove this key from "_meta" file.`
            )
          }
        }
      }
    }
    if (item) continue

    const isValid =
      metaItem.type === 'separator' || metaItem.type === 'menu' || metaItem.href

    if (!isValid) {
      throw new Error(
        `Validation of "_meta" file has failed.
The field key "${metaKey}" in \`_meta\` file refers to a page that cannot be found, remove this key from "_meta" file.`
      )
    }

    const currentItem = items[index]
    if (currentItem && currentItem.name === metaKey) continue
    items.splice(
      index, // index at which to start changing the array
      0, // remove zero items
      // @ts-expect-error fixme
      { name: metaKey, ...meta[metaKey] }
    )
  }

  if (metaKeys.length) {
    // @ts-expect-error
    items.unshift({ data: meta })
  }

  const result = isFolder ? { ...folder, children: items } : items

  return result
}
