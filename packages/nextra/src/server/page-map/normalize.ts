import { fromZodError } from 'zod-validation-error'
import type { Folder, FrontMatter, MdxFile, PageMapItem } from '../../types.js'
import { metaSchema } from '../schemas.js'
import { pageTitleFromFilename } from '../utils.js'

export function normalizePageMap(pageMap: PageMapItem[] | Folder): any {
  if (Array.isArray(pageMap)) {
    return sortFolder(
      pageMap.map(item => ('children' in item ? normalizePageMap(item) : item))
    )
  }
  return sortFolder(pageMap)
}

type ParsedFolder = Folder & {
  frontMatter?: FrontMatter
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
    } else if ('children' in item) {
      newChildren.push(normalizePageMap(item))
    } else if ('data' in item) {
      for (const [key, titleOrObject] of Object.entries(item.data)) {
        const { data, error } = metaSchema.safeParse(titleOrObject)
        if (error) {
          throw fromZodError(error)
        }
        if (key === '*') {
          // @ts-expect-error
          delete data.title
          // @ts-expect-error
          delete data.href
        }
        // @ts-expect-error
        meta[key] = data
      }
    } else {
      newChildren.push(item)
    }
  }
  if (folder.name && !folder.frontMatter?.title) {
    // @ts-expect-error -- we use title for capitalize folders without index page
    folder.title = pageTitleFromFilename(folder.name)
  }

  const metaKeys = Object.keys(meta)

  // Normalize items based on files and _meta.json.
  const items = newChildren.sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name)
    const indexB = metaKeys.indexOf(b.name)
    if (b.name === 'index') return 1
    if (a.name === 'index') return -1

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
