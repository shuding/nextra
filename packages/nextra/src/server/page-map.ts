import path from 'node:path'
import type { ArrayExpression, ImportDeclaration } from 'estree'
import { toJs } from 'estree-util-to-js'
import gracefulFs from 'graceful-fs'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'
import slash from 'slash'
import type { Folder, FrontMatter, MdxFile, PageMapItem } from '../types'
import {
  CHUNKS_DIR,
  CWD,
  MARKDOWN_EXTENSION_REGEX,
  META_REGEX
} from './constants.js'
import { APP_DIR } from './file-system.js'
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

export {
  generatePageMapFromFilepaths,
  getFilepaths
} from './generate-page-map.js'

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

      const fileRoute = normalizePageRoute(route, name)

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

  const pageMap = (await Promise.all(promises)).filter(truthy)

  return {
    // @ts-expect-error -- fixme
    pageMap,
    imports,
    dynamicMetaImports,
    hasDynamicPage
  }
}

/*
 * Use relative path instead of absolute, because it's fails on Windows
 * https://github.com/nodejs/node/issues/31710
 */
function getImportPath(filePath: string) {
  return slash(path.relative(CHUNKS_DIR, path.join(APP_DIR, filePath)))
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
  imports = [],
  dynamicMetaImports = []
}: {
  locale?: string
  pageMap: PageMapItem[]
  imports?: Import[]
  dynamicMetaImports?: DynamicImport[]
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
      source: { type: 'Literal', value: getImportPath(filePath) },
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

  //     footer = `
  // import { resolvePageMap } from 'nextra/page-map-dynamic'
  //
  // if (typeof window === 'undefined') {
  //   globalThis.__nextra_resolvePageMap ||= Object.create(null)
  //   globalThis.__nextra_resolvePageMap['${locale}'] = resolvePageMap('${locale}', dynamicMetaModules)
  // }`
  //   }

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body
  })

  return `import { normalizePageMap } from 'nextra/page-map'
${result.value}
  
export const pageMap = normalizePageMap(_pageMap)`
}

export function normalizePageMap(pageMap: PageMapItem[] | Folder): any {
  if (Array.isArray(pageMap)) {
    return sortFolder(
      pageMap.map(item => ('children' in item ? normalizePageMap(item) : item))
    )
  }
  return sortFolder(pageMap)
}

type ParsedFolder = Folder & {
  frontMatter: FrontMatter
  withIndexPage?: true
}

export function sortFolder(pageMap: PageMapItem[] | Folder) {
  const newChildren: (Folder | MdxFile)[] = []

  const isFolder = !Array.isArray(pageMap)

  const folder = (
    isFolder ? { ...pageMap } : { children: pageMap }
  ) as ParsedFolder

  const meta: Record<string, Record<string, any>> = {}

  for (const item of folder.children) {
    if (
      isFolder &&
      'frontMatter' in item &&
      item.frontMatter?.asIndexPage &&
      item.route === folder.route
    ) {
      folder.frontMatter = item.frontMatter
      folder.withIndexPage = true
    } else if ('children' in item) {
      newChildren.push(normalizePageMap(item))
    } else if ('data' in item) {
      for (const [key, titleOrObject] of Object.entries(item.data)) {
        meta[key] =
          typeof titleOrObject === 'string'
            ? { title: titleOrObject }
            : titleOrObject
        if (key === '*') {
          delete meta['*'].title
          delete meta['*'].href
        }
      }
    } else {
      newChildren.push(item)
    }
  }

  const metaKeys = Object.keys(meta || {})
  let metaKeyIndex = -1

  const children = newChildren
    .sort((a, b) => {
      const indexA = metaKeys.indexOf(a.name)
      const indexB = metaKeys.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    .flatMap(item => {
      const items = []
      const index = metaKeys.indexOf(item.name)
      let extendedItem
      if (index !== -1) {
        // Fill all skipped items in meta.
        for (let i = metaKeyIndex + 1; i < index; i++) {
          const key = metaKeys[i]
          if (key !== '*') {
            items.push({
              name: key,
              route: '',
              ...meta[key]
            })
          }
        }
        metaKeyIndex = index
        extendedItem = { ...meta[item.name], ...item }
      }
      items.push(extendedItem || item)
      return items
    })

  // Fill all skipped items in meta.
  for (let i = metaKeyIndex + 1; i < metaKeys.length; i++) {
    const key = metaKeys[i]
    if (key !== '*') {
      children.push({
        name: key,
        ...meta[key]
      } as MdxFile)
    }
  }

  if (metaKeys.length) {
    // @ts-expect-error
    children.unshift({ data: meta })
  }

  return isFolder ? { ...folder, children } : children
}
