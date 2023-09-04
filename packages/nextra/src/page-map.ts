import type { DynamicMetaDescriptor, PageMapItem } from './types'

export function getDynamicMeta(
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
      if (newItemsInChildren.length) {
        newItems.push({
          ...item,
          children: newItemsInChildren
        })
      }
      continue
    }

    if (item.kind === 'Meta' && item.__nextra_src) {
      const { __nextra_src, ...newItem } = item
      dynamicMetaItems.push({
        metaFilePath: __nextra_src,
        metaObjectKeyPath: `${path}[${i}]`,
        metaParentKeyPath: path.replace(/\.children$/, '')
      })
      newItems.push(newItem)
      continue
    }
    newItems.push(item)
  }

  return [dynamicMetaItems, newItems]
}
