import type { MdxFile, PageMapItem, SeparatorItem } from '../../types.js'
import { compileMdx } from '../compile.js'

function renderCard(item: MdxFile): string {
  const icon = item.frontMatter?.icon
  const Icon = icon ? `<${icon}/>` : 'null'
  // @ts-expect-error -- fixme
  return `<Cards.Card title="${item.title}" href="${item.route}" icon={${Icon}} />`
}

export async function createIndexPage(pageMap: PageMapItem[]): Promise<string> {
  const result = []
  let hasCards = false
  for (const item of pageMap) {
    if ('data' in item) {
      continue
    }
    // @ts-expect-error fixme
    if (item.type === 'separator') {
      if (hasCards) {
        result.push('</Cards>')
        hasCards = false
      }
      // @ts-expect-error fixme
      result.push(`## ${item.title}`)
      continue
    }
    if (!hasCards) {
      hasCards = true
      result.push('<Cards>')
    }
    result.push(renderCard(item))
  }
  if (hasCards) {
    result.push('</Cards>')
  }
  const rawMdx = result.join('\n')

  const rawJs = await compileMdx(rawMdx)

  return rawJs
}

export function getIndexPageMap(pageMap: PageMapItem[]) {
  const result: (SeparatorItem | MdxFile[])[] = []
  for (const item of pageMap) {
    if ('data' in item) {
      continue
    }
    // @ts-expect-error fixme
    if (item.type === 'separator') {
      // @ts-expect-error fixme
      result.push(item)
    } else {
      const lastResult = result.at(-1)
      if (Array.isArray(lastResult)) {
        lastResult.push(item)
      } else {
        result.push([item])
      }
    }
  }
  return result
}
