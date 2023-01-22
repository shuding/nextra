import { FileMap, MdxPath, PageMapItem, DynamicMetaDescriptor } from './types'
import { parseFileName } from './utils'
import filterRouteLocale from './filter-route-locale'
import { IS_PRODUCTION } from './constants'

type PageMapProps = {
  filePath: string
  items: PageMapItem[]
  fileMap: FileMap
  defaultLocale: string
}

function getDynamicMeta(
  path: string,
  items: PageMapItem[]
): [DynamicMetaDescriptor[], PageMapItem[]] {
  const newItems: PageMapItem[] = []
  const dynamicMetaItems: DynamicMetaDescriptor[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'Folder') {
      const [dynamicItemsInChildren, newItemsInChildren] = getDynamicMeta(
        `${path}[${i}].children`,
        item.children
      )
      dynamicMetaItems.push(...dynamicItemsInChildren)
      newItems.push({
        ...item,
        children: newItemsInChildren
      })
      continue
    }

    if (item.kind === 'Meta' && item.__nextra_src) {
      const { __nextra_src, ...newItem } = item
      dynamicMetaItems.push({
        metaFilePath: __nextra_src,
        metaObjectKeyPath: `${path}[${i}]`,
        metaParentKeyPath: path
      })
      newItems.push(newItem)
      continue
    }
    newItems.push(item)
  }

  return [dynamicMetaItems, newItems]
}

const cachedDynamicMetaForLocale: Record<
  string,
  [DynamicMetaDescriptor[], PageMapItem[]]
> = Object.create(null)

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

  const [dynamicMetaItems, newItems] =
    (IS_PRODUCTION && cachedDynamicMetaForLocale[locale]) ||
    (cachedDynamicMetaForLocale[locale] = getDynamicMeta(
      '',
      locale ? filterRouteLocale(items, locale, defaultLocale) : items
    ))

  return {
    pageMap: newItems,
    route: pageItem.route,
    dynamicMetaItems
  }
}
