import path from 'node:path'
import type { ArrayExpression, ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import gracefulFs from 'graceful-fs'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'
import slash from 'slash'
import type { PageMapItem } from '../types'
import {
  CHUNKS_DIR,
  CWD,
  MARKDOWN_EXTENSION_REGEX,
  META_REGEX
} from './constants.js'
import { APP_DIR } from './file-system.js'
import {
  createAstObject,
  normalizePageRoute,
  pageTitleFromFilename
} from './utils.js'

const fs = gracefulFs.promises

const limit = pLimit(20)

type Import = {
  importName: string
  filePath: string
}
type DynamicImport = {
  importName: string
  route: string
}

type CollectFilesOptions = {
  dir: string
  route: string
  imports?: Import[]
  dynamicMetaImports?: DynamicImport[]
  isFollowingSymlink: boolean
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
        value: getImportPath(locale ? [locale, filePath] : [filePath], fromAppDir)
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

  const body: Parameters<typeof toJs>[0]['body'] = [
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

  // let footer = ''

  // if (dynamicMetaImports.length) {
  //   body.push({
  //     type: 'VariableDeclaration',
  //     kind: 'const',
  //     declarations: [
  //       {
  //         type: 'VariableDeclarator',
  //         id: { type: 'Identifier', name: 'dynamicMetaModules' },
  //         init: {
  //           type: 'ObjectExpression',
  //           properties: dynamicMetaImports
  //             // localeCompare to avoid race condition
  //             .sort((a, b) => a.route.localeCompare(b.route))
  //             .map(({ importName, route }) => ({
  //               ...DEFAULT_PROPERTY_PROPS,
  //               key: { type: 'Literal', value: route },
  //               value: { type: 'Identifier', name: importName }
  //             }))
  //         }
  //       }
  //     ]
  //   })

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body
  })

  return `import { normalizePageMap } from 'nextra/page-map'
${result.value}
  
export const pageMap = normalizePageMap(_pageMap)

export const RouteToFilepath = ${JSON.stringify(mdxPages, null, 2)}`
}
