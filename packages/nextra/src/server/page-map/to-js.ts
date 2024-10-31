import path from 'node:path'
import type { ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import type { TItem, Import } from '../../types.js'
import { META_RE } from '../constants.js'
import { convertPageMapToAst } from './to-ast.js'

export async function transformPageMapToJs({
  pageMap,
  mdxPages
}: {
  pageMap: TItem[]
  mdxPages: Record<string, string>
}): Promise<string> {
  const imports: Import[] = []
  const pageMapAst = convertPageMapToAst(pageMap, imports)
  const importsAst: ImportDeclaration[] = imports
    // localeCompare to avoid race condition
    .sort((a, b) => a.filePath.localeCompare(b.filePath))
    .map(({ filePath, importName }) => ({
      type: 'ImportDeclaration',
      source: {
        type: 'Literal',
        // Use `path.posix` instead of `slash` package because `filePath` already have posix slashes
        value: path.posix.join('private-next-root-dir', filePath)
      },
      specifiers: [
        {
          local: { type: 'Identifier', name: importName },
          ...(META_RE.test(filePath)
            ? { type: 'ImportDefaultSpecifier' }
            : {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'metadata' }
              })
        }
      ]
    }))

  const importsResult = toJs({
    type: 'Program',
    sourceType: 'module',
    body: importsAst
  })

  const pageMapResult = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [{ type: 'ExpressionStatement', expression: pageMapAst }]
  })

  const rawJs = `import { normalizePageMap } from 'nextra/page-map'
${importsResult.value}
export const pageMap = normalizePageMap(${pageMapResult.value.slice(0, -2 /* replace semicolon */)})

export const RouteToFilepath = ${JSON.stringify(mdxPages, null, 2)}`
  return rawJs
}
