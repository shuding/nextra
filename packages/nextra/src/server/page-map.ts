import path from 'node:path'
import type { ArrayExpression, ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import type { PageMapItem } from '../types'
import { META_RE } from './constants.js'
import { APP_DIR } from './file-system.js'
import { createAstObject } from './utils.js'

type Import = {
  importName: string
  filePath: string
}

export {
  generatePageMapFromFilepaths,
  getFilepaths
} from './generate-page-map.js'
export { normalizePageMap } from './normalize-page-map.js'

function cleanFileName(name: string): string {
  return (
    path
      .relative(APP_DIR, name)
      .replace(/\.([jt]sx?|mdx?)$/, '')
      .replaceAll(/[\W_]+/g, '_')
      .replace(/^_/, '')
      // Variable can't start with number
      .replace(/^\d/, (match: string) => `_${match}`)
  )
}

function convertPageMapToAst(
  pageMap: PageMapItem[],
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
      // @ts-expect-error
      const pagePath = item.__pagePath
      let name = ''

      if (pagePath) {
        name = cleanFileName(pagePath)
        imports.push({ importName: name, filePath: pagePath })
      }
      return createAstObject({
        name: item.name,
        route: item.route,
        ...(name && { frontMatter: { type: 'Identifier', name } })
      })
    }
    // @ts-expect-error
    const name = cleanFileName(item.__metaPath)
    // @ts-expect-error
    imports.push({ importName: name, filePath: item.__metaPath })
    return createAstObject({
      data: { type: 'Identifier', name }
    })
  })

  return { type: 'ArrayExpression', elements }
}

export async function collectPageMap({
  pageMap,
  mdxPages
}: {
  pageMap: PageMapItem[]
  mdxPages: Record<string, string>
}): Promise<string> {
  const someImports: Import[] = []
  const pageMapAst = convertPageMapToAst(
    pageMap,
    someImports
    // transformPageMap ? transformPageMap(pageMap, locale) : pageMap
  )

  const metaImportsAST: ImportDeclaration[] = someImports
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

  const pageMapResult = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [
      ...metaImportsAST,
      {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: '_pageMap' },
            init: pageMapAst
          }
        ]
      }
    ]
  })

  const rawJs = `import { normalizePageMap } from 'nextra/page-map'
${pageMapResult.value}
export const pageMap = normalizePageMap(_pageMap)

export const RouteToFilepath = ${JSON.stringify(mdxPages, null, 2)}
`
  return rawJs
}

export async function getPageMap(lang = '') {
  const { pageMap } = await import(`./page-map-placeholder.js?lang=${lang}`)
  return pageMap
}
