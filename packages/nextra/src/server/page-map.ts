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
  DEFAULT_PROPERTY_PROPS,
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

export async function collectFiles({
  dir,
  route,
  imports = [],
  dynamicMetaImports = [],
  isFollowingSymlink
}: CollectFilesOptions): Promise<{
  pageMap: PageMapItem[]
  imports: Import[]
  dynamicMetaImports: DynamicImport[]
  hasDynamicPage: boolean
}> {
  const files = await fs.readdir(dir, { withFileTypes: true })

  let hasDynamicPage = false

  const promises = files
    // localeCompare is needed because order on Windows is different and test on CI fails
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(async f => {
      const filePath = path.join(dir, f.name)

      let isDirectory = f.isDirectory()

      const isSymlinked = isFollowingSymlink || f.isSymbolicLink()
      if (isSymlinked) {
        const stats = await fs.stat(filePath)
        if (stats.isDirectory()) {
          isDirectory = true
        }
      }

      const { name, ext } = path.parse(filePath)

      // We need to filter out dynamic routes, because we can't get all the
      // paths statically from here — they'll be generated separately.
      if (name.startsWith('[')) {
        hasDynamicPage = true
        return
      }

      const fileRoute = normalizePageRoute(
        route,
        // Directory could have dot, e.g. graphql-eslint-3.14
        isDirectory ? name + ext : name
      )

      if (isDirectory) {
        if (fileRoute === '/api') return
        const { pageMap: children, hasDynamicPage } = await collectFiles({
          dir: filePath,
          route: fileRoute,
          imports,
          dynamicMetaImports,
          isFollowingSymlink
        })

        if (!children.length && !hasDynamicPage) return

        return {
          name: f.name,
          route: fileRoute,
          children
        }
      }

      // add concurrency because folder can contain a lot of files
      return limit(async () => {
        if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
          // let frontMatter: Expression

          // if (IMPORT_FRONTMATTER) {
          // const importName = cleanFileName(filePath)
          // imports.push({ importName, filePath })
          // frontMatter = { type: 'Identifier', name: importName }
          // } else {
          const content = await fs.readFile(filePath, 'utf8')
          const { data } = grayMatter(content)
          if (!data.title) {
            data.sidebarTitle = pageTitleFromFilename(name)
          }
          // }

          return {
            name,
            route: fileRoute,
            frontMatter: data
          }
        }

        const fileName = name + ext
        const isMetaJs = META_REGEX.test(fileName)

        if (fileName === '_meta.json') {
          throw new Error(
            'Support of "_meta.json" was removed, use "_meta.{js,jsx,ts,tsx}" instead. ' +
              `Refactor following file "${path.relative(CWD, filePath)}".`
          )
        }

        if (isMetaJs) {
          const importName = cleanFileName(filePath)
          imports.push({ importName, filePath })

          if (hasDynamicPage) {
            dynamicMetaImports.push({ importName, route })
            return
          }
          return { data: importName }
        }
      })
    })

  const pageMap = (await Promise.all(promises)).filter(v => !!v)

  return {
    // @ts-expect-error -- fixme
    pageMap,
    imports,
    dynamicMetaImports,
    hasDynamicPage
  }
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

  /*
   * Use relative path instead of absolute, because it's fails on Windows
   * https://github.com/nodejs/node/issues/31710
   */
  function getImportPath(filePaths: string[]) {
    return slash(
      path.relative(
        CHUNKS_DIR,
        fromAppDir
          ? path.join(APP_DIR, ...filePaths)
          : path.join(process.cwd(), 'mdx', ...filePaths)
      )
    )
  }

  const metaImportsAST: ImportDeclaration[] = someImports
    // localeCompare to avoid race condition
    .sort((a, b) => a.filePath.localeCompare(b.filePath))
    .map(({ filePath, importName }) => ({
      type: 'ImportDeclaration',
      source: {
        type: 'Literal',
        value: getImportPath(locale ? [locale, filePath] : [filePath])
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
