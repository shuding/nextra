import { FileMap, MdxPath, PageMapItem } from './types'
import { parseFileName } from './utils'
import filterRouteLocale from './filter-route-locale'

type PageMapProps = {
  filePath: string
  items: PageMapItem[]
  fileMap: FileMap
  defaultLocale: string
}

type DynamicMetaDescriptor = {
  metaFilePath: string
  metaObjectKeyPath: string
  metaParentKeyPath: string
}

function getDynamicMeta(
  path: string,
  items: PageMapItem[]
): [DynamicMetaDescriptor[], PageMapItem[]] {
  const newItems = []
  const dynamicMetaItems: DynamicMetaDescriptor[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'Folder') {
      const [dynamicItemsInChildren, newItemsInChildren] = getDynamicMeta(
        path + `[${i}].children`,
        item.children
      )
      dynamicMetaItems.push(...dynamicItemsInChildren)
      newItems.push({
        ...item,
        children: newItemsInChildren
      })
    } else if (item.kind === 'Meta') {
      if (item.__nextra_src) {
        dynamicMetaItems.push({
          metaFilePath: item.__nextra_src,
          metaObjectKeyPath: path + `[${i}]`,
          metaParentKeyPath: path
        })
        const newItem = {
          ...item
        }
        delete newItem.__nextra_src
        newItems.push(newItem)
      } else {
        newItems.push(item)
      }
    } else {
      newItems.push(item)
    }
  }

  return [dynamicMetaItems, newItems]
}

export function resolvePageMap({
  filePath,
  items,
  fileMap,
  defaultLocale
}: PageMapProps): {
  route: string
  pageMap: PageMapItem[]
  dynamicMetaItems: DynamicMetaDescriptor[]
} {
  const { locale } = parseFileName(filePath)
  const pageItem = fileMap[filePath as MdxPath]

  const [dynamicMetaItems, newItems] = getDynamicMeta(
    '',
    locale ? filterRouteLocale(items, locale, defaultLocale) : items
  )

  return {
    pageMap: newItems,
    route: pageItem.route,
    dynamicMetaItems
  }
}
