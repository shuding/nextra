import type {
  FileMap,
  MdxPath,
  PageMapItem,
  DynamicMetaDescriptor
} from './types'
import filterRouteLocale from './filter-route-locale'
import { IS_PRODUCTION } from './constants'

type PageMapProps = {
  filePath: string
  items: PageMapItem[]
  fileMap: FileMap
  defaultLocale: string
}

export function getDynamicMeta(
  path: string,
  items: PageMapItem[],
  locale?: string
): [DynamicMetaDescriptor[], PageMapItem[]] {
  const newItems: PageMapItem[] = []
  const dynamicMetaItems: DynamicMetaDescriptor[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'Folder') {
      const [dynamicItemsInChildren, newItemsInChildren] = getDynamicMeta(
        `${path}[${i}].children`,
        item.children,
        locale
      )
      dynamicMetaItems.push(...dynamicItemsInChildren)
      if (newItemsInChildren.length) {
        newItems.push({
          ...item,
          children: newItemsInChildren
        })
      }
      continue
    }

    if (item.kind === 'Meta' && item.__nextra_src) {
      if (locale === item.locale) {
        const { __nextra_src, ...newItem } = item
        dynamicMetaItems.push({
          metaFilePath: __nextra_src,
          metaObjectKeyPath: `${path}[${i}]`,
          metaParentKeyPath: path.replace(/\.children$/, '')
        })
        newItems.push(newItem)
      }
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
  const { locale, route } = fileMap[filePath as MdxPath]
  const localeKey = locale || ''

  const [dynamicMetaItems, newItems] =
    (IS_PRODUCTION && cachedDynamicMetaForLocale[localeKey]) ||
    (cachedDynamicMetaForLocale[localeKey] = getDynamicMeta(
      '',
      locale ? filterRouteLocale(items, locale, defaultLocale) : items,
      locale
    ))

  return {
    pageMap: newItems,
    route,
    dynamicMetaItems
  }
}
