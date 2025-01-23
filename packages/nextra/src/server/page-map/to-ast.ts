import path from 'node:path'
import type { ArrayExpression } from 'estree'
import type { Import, TItem } from '../../types.js'
import { createAstObject } from '../utils.js'

function cleanFilePath(filePath: string): string {
  // Remove extension
  const { dir, name } = path.parse(filePath)
  // Remove `content` prefix
  const fileName = `${dir.replace(/^(src\/)?content\/?/, '')}_${name}`
  return (
    // handle non-"\w" characters
    encodeURI(fileName)
      .replaceAll(/[\W_]+/g, '_')
      // Remove leading `_`
      .replace(/^_/, '')
      // Variable can't start with a number
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
      const filePath = item.__pagePath
      const importName = cleanFilePath(filePath)
      imports.push({ importName, filePath })
      return createAstObject({
        name: item.name,
        route: item.route,
        frontMatter: { type: 'Identifier', name: importName }
      })
    }
    const filePath = item.__metaPath
    const importName = cleanFilePath(filePath)
    imports.push({ importName, filePath })
    return createAstObject({
      data: { type: 'Identifier', name: importName }
    })
  })

  return { type: 'ArrayExpression', elements }
}
