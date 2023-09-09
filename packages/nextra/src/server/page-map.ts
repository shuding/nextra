import path from 'node:path'
import { promisify } from 'node:util'
import type {
  ArrayExpression,
  ExportNamedDeclaration,
  Expression,
  ImportDeclaration,
  ObjectExpression,
  Property
} from 'estree'
import { toJs } from 'estree-util-to-js'
import { valueToEstree } from 'estree-util-value-to-estree'
import fs from 'graceful-fs'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'
import {
  MARKDOWN_EXTENSION_REGEX,
  META_FILENAME,
  META_REGEX
} from '../constants'
import { truthy } from '../utils'
import { PAGES_DIR } from './file-system'
import { normalizePageRoute, pageTitleFromFilename } from './utils'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const stat = promisify(fs.stat)

const limit = pLimit(20)

type Import = { importName: string; filePath: string }
type DynamicImport = { importName: string; route: string }

const DEFAULT_OBJECT_PROPS: Omit<Property, 'key' | 'value'> = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
}

function createAstObject(
  obj: Record<string, string | Expression>
): ObjectExpression {
  return {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([key, value]) => ({
      ...DEFAULT_OBJECT_PROPS,
      key: { type: 'Identifier', name: key },
      value:
        value && typeof value === 'object' ? value : { type: 'Literal', value }
    }))
  }
}

function createAstExportConst(
  name: string,
  value: ArrayExpression | ObjectExpression
): ExportNamedDeclaration {
  return {
    type: 'ExportNamedDeclaration',
    specifiers: [],
    declaration: {
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name },
          init: value
        }
      ]
    }
  }
}

type CollectFilesOptions = {
  dir: string
  route: string
  metaImports?: Import[]
  dynamicMetaImports?: DynamicImport[]
  isFollowingSymlink: boolean
}

async function collectFiles({
  dir,
  route,
  metaImports = [],
  dynamicMetaImports = [],
  isFollowingSymlink
}: CollectFilesOptions): Promise<{
  pageMapAst: ArrayExpression
  metaImports: Import[]
  dynamicMetaImports: DynamicImport[]
}> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files
    // localeCompare is needed because order on Windows is different and test on CI fails
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(async (f, _index, array) => {
      const filePath = path.join(dir, f.name)

      let isDirectory = f.isDirectory()

      const isSymlinked = isFollowingSymlink || f.isSymbolicLink()
      if (isSymlinked) {
        const stats = await stat(filePath)
        if (stats.isDirectory()) {
          isDirectory = true
        }
      }

      const { name, ext } = path.parse(filePath)

      // We need to filter out dynamic routes, because we can't get all the
      // paths statically from here — they'll be generated separately.
      if (name.startsWith('[')) return

      const fileRoute = normalizePageRoute(route, name)

      if (isDirectory) {
        if (fileRoute === '/api') return
        const { pageMapAst } = await collectFiles({
          dir: filePath,
          route: fileRoute,
          metaImports,
          dynamicMetaImports,
          isFollowingSymlink
        })

        const { elements } = pageMapAst
        if (!elements.length) return

        return createAstObject({
          name: f.name,
          route: fileRoute,
          children: pageMapAst
        })
      }

      // add concurrency because folder can contain a lot of files
      return limit(async () => {
        if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
          const content = await readFile(filePath, 'utf8')
          const { data } = grayMatter(content)

          return createAstObject({
            name: path.parse(filePath).name,
            route: fileRoute,
            ...(Object.keys(data).length && {
              frontMatter: valueToEstree(data)
            })
          })
        }

        const fileName = name + ext
        const isMetaJs = META_REGEX.test(fileName)

        if (fileName === META_FILENAME || isMetaJs) {
          const importName = path
            .relative(PAGES_DIR, filePath)
            .replace(/\.([jt]sx?|json)?$/, '')
            .replaceAll(/[\W_]+/g, '_')
            .replace(/^_/, '')
          metaImports.push({ importName, filePath })
          if (isMetaJs) {
            const dynamicPage = array.find(f => f.name.startsWith('['))
            if (dynamicPage) {
              dynamicMetaImports.push({ importName, route })
              return createAstObject({ data: createAstObject({}) })
            }
          }
          return createAstObject({
            data: { type: 'Identifier', name: importName }
          })
        }
      })
    })

  const items = (await Promise.all(promises)).filter(truthy)

  // @ts-expect-error TODO: fix type
  const hasMeta = items.some(item => item.properties[0].key.name === 'data')

  if (!hasMeta) {
    const allPages = items
      // Capitalize name of pages and folders
      // @ts-expect-error TODO: fix type
      .map(item => item.properties[0].value.value)

    items.unshift(
      createAstObject({
        data: valueToEstree(
          Object.fromEntries(
            allPages.map(name => [name, pageTitleFromFilename(name)])
          )
        )
      })
    )
  }

  return {
    pageMapAst: { type: 'ArrayExpression', elements: items },
    metaImports,
    dynamicMetaImports
  }
}

export async function collectPageMap({
  dir,
  route = '/'
}: {
  dir: string
  route?: string
}): Promise<string> {
  const { pageMapAst, metaImports, dynamicMetaImports } = await collectFiles({
    dir,
    route,
    isFollowingSymlink: false
  })

  const metaImportsAST: ImportDeclaration[] = metaImports
    // localeCompare to avoid race condition
    .sort((a, b) => a.filePath.localeCompare(b.filePath))
    .map(({ filePath, importName }) => ({
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: filePath },
      specifiers: [
        {
          type: 'ImportDefaultSpecifier',
          local: { type: 'Identifier', name: importName }
        }
      ]
    }))

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [
      ...metaImportsAST,
      createAstExportConst('pageMap', pageMapAst),
      createAstExportConst('dynamicMetaModules', {
        type: 'ObjectExpression',
        properties: dynamicMetaImports
          // localeCompare to avoid race condition
          .sort((a, b) => a.route.localeCompare(b.route))
          .map(({ importName, route }) => ({
          ...DEFAULT_OBJECT_PROPS,
          key: { type: 'Literal', value: route },
          value: { type: 'Identifier', name: importName }
        }))
      })
    ]
  })

  return result.value.trim()
}
