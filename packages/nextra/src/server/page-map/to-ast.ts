import path from 'node:path'
import type { ArrayExpression } from 'estree'
import type { Import, TItem } from '../../types.js'
import { createAstObject } from '../utils.js'

function cleanFilePath(filePath: string): string {
  // Remove extension
  const { dir, name } = path.parse(filePath)
  return (
    // Remove `content` prefix
    `${dir.replace(/^content\/?/, '')}_${name}`
      .replaceAll(/[\W_]+/g, '_')
      // Remove leading `_`
      .replace(/^_/, '')
      // Variable can't start with number
      .replace(/^\d/, match => `_${match}`)
  )
}

export function convertPageMapToAst(
  pageMap: TItem[],
  imports: Import[]
): ArrayExpression {
  const elements = pageMap.map(item => {
    if ('children' in item) {
      return createAstObject({
        name: item.name,
        route: item.route,
        children: convertPageMapToAst(item.children, imports)
      })
    }
    if ('route' in item) {
      const pagePath = item.__pagePath
      let name = ''

      if (pagePath) {
        name = cleanFilePath(pagePath)
        imports.push({ importName: name, filePath: pagePath })
      }
      return createAstObject({
        name: item.name,
        route: item.route,
        ...(name && { frontMatter: { type: 'Identifier', name } })
      })
    }
    const name = cleanFilePath(item.__metaPath)
    imports.push({ importName: name, filePath: item.__metaPath })
    return createAstObject({
      data: { type: 'Identifier', name }
    })
  })

  return { type: 'ArrayExpression', elements }
}
