import path from 'node:path'
import type { ArrayExpression, ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import slash from 'slash'
import type { PageMapItem } from '../types'
import { CHUNKS_DIR, META_REGEX, DEFAULT_PROPERTY_PROPS } from './constants.js'
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
      .replace(/\.([jt]sx?|json|mdx?)$/, '')
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

/*
 * Use relative path instead of absolute, because it's fails on Windows
 * https://github.com/nodejs/node/issues/31710
 */
function getImportPath(filePaths: string[], fromAppDir = false): string {
  const importPath = slash(
    path.relative(
      CHUNKS_DIR,
      fromAppDir
        ? path.join(APP_DIR, ...filePaths)
        : path.join(process.cwd(), 'mdx', ...filePaths)
    )
  )
  return importPath.startsWith('.') ? importPath : `./${importPath}`
}

export async function collectPageMap({
  locale = '',
  pageMap,
  mdxPages,
  fromAppDir
}: {
  locale?: string
  pageMap: PageMapItem[]
  mdxPages: Record<string, string>
  fromAppDir: boolean
}): Promise<void> {
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
        value: getImportPath(
          locale ? [locale, filePath] : [filePath],
          fromAppDir
        )
      },
      specifiers: [
        {
          local: { type: 'Identifier', name: importName },
          ...(META_REGEX.test(filePath)
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

  const pagesResult = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [
      {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'RouteToPage' },
            init: {
              type: 'ObjectExpression',
              properties: Object.entries(mdxPages)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([key, value]) => ({
                  ...DEFAULT_PROPERTY_PROPS,
                  key: { type: 'Literal', value: key },
                  value: {
                    type: 'ArrowFunctionExpression',
                    expression: true,
                    params: [],
                    body: {
                      type: 'CallExpression',
                      optional: false,
                      callee: { type: 'Identifier', name: 'import' },
                      arguments: [
                        {
                          type: 'Literal',
                          value: path.join(
                            'private-next-root-dir',
                            'mdx',
                            value
                          )
                        }
                      ]
                    }
                  }
                }))
            }
          }
        ]
      }
    ]
  })

  await fs.writeFile(
    path.join(CHUNKS_DIR, `nextra-pages-${locale}.mjs`),
    `export ${pagesResult.value}`
  )

  const rawJs = `import { normalizePageMap } from 'nextra/page-map'
${pageMapResult.value}

export const pageMap = normalizePageMap(_pageMap)`

  await fs.writeFile(
    path.join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`),
    rawJs
  )
}
