import { MdxFile, PageMapItem } from '../../types'
import { compileMdx } from '../compile.js'

function renderCard(item: MdxFile): string {
  const { icon, sidebarTitle, title } = item.frontMatter!
  const Icon = icon ? `<${icon}/>` : 'null'
  return `<Cards.Card title="${sidebarTitle || title}" href="${item.route}" icon={${Icon}} />`
}

export async function createIndexPage(pageMap: PageMapItem[]): Promise<string> {
  let result = []
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
  const rawJsx = result.join('\n')

  const mdx = await compileMdx(rawJsx)

  return mdx.result
}
