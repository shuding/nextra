import type { ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import type { Import, TItem } from '../../types.js'
import { MARKDOWN_EXTENSION_RE, METADATA_ONLY_RQ } from '../constants.js'
import { convertPageMapToAst } from './to-ast.js'

const META_RE = /_meta\.[jt]sx?$/

export function convertPageMapToJs({
  pageMap,
  mdxPages,
  globalMetaPath
}: {
  pageMap: TItem[]
  mdxPages: Record<string, string>
  globalMetaPath?: string
}): string {
  const imports: Import[] = []
  const pageMapAst = convertPageMapToAst(pageMap, imports)
  const importsAst: ImportDeclaration[] = imports.map(
    ({ filePath, importName }) => {
      const isMdx = MARKDOWN_EXTENSION_RE.test(filePath)
      const isMeta = META_RE.test(filePath)
      return {
        type: 'ImportDeclaration',
        source: {
          type: 'Literal',
          // Add resource query only for `.md`, `.mdx` files
          value: `private-next-root-dir/${filePath}${isMdx ? METADATA_ONLY_RQ : ''}`
        },
        specifiers: [
          isMeta || isMdx
            ? {
                local: { type: 'Identifier', name: importName },
                ...(isMeta
                  ? { type: 'ImportDefaultSpecifier' }
                  : {
                      type: 'ImportSpecifier',
                      imported: { type: 'Identifier', name: 'metadata' }
                    })
              }
            : {
                type: 'ImportNamespaceSpecifier',
                local: { type: 'Identifier', name: importName }
              }
        ]
      }
    }
  )

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

  let pageMapRawJs = pageMapResult.value.slice(0, -2 /* replace semicolon */)
  if (globalMetaPath) {
    pageMapRawJs = `mergeMetaWithPageMap(${pageMapRawJs}, globalMeta, true)`
  }

  const rawJs = `import { ${[
    'normalizePageMap',
    globalMetaPath && 'mergeMetaWithPageMap',
    imports.some(
      o => !MARKDOWN_EXTENSION_RE.test(o.filePath) && !META_RE.test(o.filePath)
    ) && 'getMetadata'
  ]
    .filter(Boolean)
    .join(', ')} } from 'nextra/page-map'
${globalMetaPath ? `import globalMeta from 'private-next-root-dir/${globalMetaPath}'` : ''}
${importsResult.value}
export const pageMap = normalizePageMap(${pageMapRawJs})

export const RouteToFilepath = ${JSON.stringify(mdxPages, null, 2)}`
  return rawJs
}
