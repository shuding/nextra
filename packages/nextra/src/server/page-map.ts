import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ArrayExpression, Expression, ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import { valueToEstree } from 'estree-util-value-to-estree'
import gracefulFs from 'graceful-fs'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'
import {
  CWD,
  DEFAULT_PROPERTY_PROPS,
  IMPORT_FRONTMATTER,
  MARKDOWN_EXTENSION_REGEX,
  META_REGEX
} from './constants.js'
import { PAGES_DIR } from './file-system.js'
import {
  createAstExportConst,
  createAstObject,
  normalizePageRoute,
  pageTitleFromFilename,
  truthy
} from './utils.js'

const fs = gracefulFs.promises

const limit = pLimit(20)

type Import = { importName: string; filePath: string }
type DynamicImport = { importName: string; route: string }

type CollectFilesOptions = {
  dir: string
  route: string
  imports?: Import[]
  dynamicMetaImports?: DynamicImport[]
  isFollowingSymlink: boolean
}

function cleanFileName(name: string): string {
  return (
    path
      .relative(PAGES_DIR, name)
      .replace(/\.([jt]sx?|json|mdx?)$/, '')
      .replaceAll(/[\W_]+/g, '_')
      .replace(/^_/, '')
      // Variable can't start with number
      .replace(/^\d/, (match: string) => `_${match}`)
  )
}

async function collectFiles({
  dir,
  route,
  imports = [],
  dynamicMetaImports = [],
  isFollowingSymlink
}: CollectFilesOptions): Promise<{
  pageMapAst: ArrayExpression
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
      console.log('pageMap', { filePath })

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

      const fileRoute = normalizePageRoute(route, name)

      if (isDirectory) {
        if (fileRoute === '/api') return
        const { pageMapAst, hasDynamicPage } = await collectFiles({
          dir: filePath,
          route: fileRoute,
          imports,
          dynamicMetaImports,
          isFollowingSymlink
        })

        const { elements } = pageMapAst

        if (!elements.length && !hasDynamicPage) return

        return createAstObject({
          name: f.name,
          route: fileRoute,
          children: pageMapAst
        })
      }

      // add concurrency because folder can contain a lot of files
      return limit(async () => {
        if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
          let frontMatter: Expression

          if (IMPORT_FRONTMATTER) {
            const importName = cleanFileName(filePath)
            imports.push({ importName, filePath })
            frontMatter = { type: 'Identifier', name: importName }
          } else {
            const content = await fs.readFile(filePath, 'utf8')
            const { data } = grayMatter(content)
            frontMatter = valueToEstree({
              sidebar_label: pageTitleFromFilename(name),
              ...data
            })
          }

          return createAstObject({
            name: path.parse(filePath).name,
            route: fileRoute,
            frontMatter
          })
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
          console.log('pageMap', { importName })
          imports.push({ importName, filePath })

          if (hasDynamicPage) {
            dynamicMetaImports.push({ importName, route })
            return
          }
          return createAstObject({
            data: { type: 'Identifier', name: importName }
          })
        }
      })
    })

  const items = (await Promise.all(promises)).filter(truthy)

  return {
    pageMapAst: { type: 'ArrayExpression', elements: items },
    imports,
    dynamicMetaImports,
    hasDynamicPage
  }
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))


/*
 * Use relative path instead of absolute, because it's fails on Windows
 * https://github.com/nodejs/node/issues/31710
 */
function getImportPath(filePath: string) {
  const filePath2 = path.relative(__dirname, filePath)
  console.log('pageMap', { filePath2 })
  return filePath2
}

export async function collectPageMap({
  dir,
  route = '/',
  locale = ''
}: {
  dir: string
  route?: string
  locale?: string
}): Promise<string> {
  const { pageMapAst, imports, dynamicMetaImports } = await collectFiles({
    dir,
    route,
    isFollowingSymlink: false
  })

  const metaImportsAST: ImportDeclaration[] = imports
    // localeCompare to avoid race condition
    .sort((a, b) => a.filePath.localeCompare(b.filePath))
    .map(({ filePath, importName }) => ({
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: getImportPath(filePath) },
      specifiers: [
        {
          local: { type: 'Identifier', name: importName },
          ...(IMPORT_FRONTMATTER && MARKDOWN_EXTENSION_REGEX.test(filePath)
            ? {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'frontMatter' }
              }
            : { type: 'ImportDefaultSpecifier' })
        }
      ]
    }))

  const body: Parameters<typeof toJs>[0]['body'] = [
    ...metaImportsAST,
    createAstExportConst('pageMap', pageMapAst)
  ]
  let footer = ''

  if (dynamicMetaImports.length) {
    body.push({
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'dynamicMetaModules' },
          init: {
            type: 'ObjectExpression',
            properties: dynamicMetaImports
              // localeCompare to avoid race condition
              .sort((a, b) => a.route.localeCompare(b.route))
              .map(({ importName, route }) => ({
                ...DEFAULT_PROPERTY_PROPS,
                key: { type: 'Literal', value: route },
                value: { type: 'Identifier', name: importName }
              }))
          }
        }
      ]
    })

    footer = `
import { resolvePageMap } from 'nextra/setup-page'

if (typeof window === 'undefined') {
  globalThis.__nextra_resolvePageMap ||= Object.create(null)
  globalThis.__nextra_resolvePageMap['${locale}'] = resolvePageMap('${locale}', dynamicMetaModules)
}`
  }

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body
  })

  return `${result.value}${footer}`.trim()
}
