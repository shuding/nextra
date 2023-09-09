import path from 'node:path'
import { promisify } from 'node:util'
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
import type { PageMapItem } from '../types'
import { truthy } from '../utils'
import { normalizePageRoute } from './utils'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

// TODO: `1` is set due race condition when import order is different, find a better solution to
//  keep things more parallel
const limit = pLimit(1)

type Import = { importName: string; filePath: string }
type DynamicImport = { importName: string; route: string }

function createAstObject(obj: Record<string, unknown>) {
  return {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([key, value]) => ({
      type: 'Property',
      kind: 'init',
      key: { type: 'Identifier', name: key },
      value:
        value && typeof value === 'object' ? value : { type: 'Literal', value }
    }))
  }
}

function createAstExportConst<T>(name: string, value: T) {
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

async function collectFiles({
  dir,
  route = '/',
  metaImports = [],
  dynamicMetaImports = []
}: {
  dir: string
  route?: string
  isFollowingSymlink?: boolean
  metaImports?: Import[]
  dynamicMetaImports?: DynamicImport[]
}): Promise<{
  pageMapAst: PageMapItem[]
  metaImports: Import[]
  dynamicMetaImports: DynamicImport[]
}> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files
    // localeCompare is needed because order on Windows is different and test on CI fails
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(async (f, _index, array) => {
      const filePath = path.join(dir, f.name)
      const { name, ext } = path.parse(filePath)

      // We need to filter out dynamic routes, because we can't get all the
      // paths statically from here — they'll be generated separately.
      if (name.startsWith('[')) return

      const fileRoute = normalizePageRoute(route, name)

      if (f.isDirectory()) {
        if (fileRoute === '/api') return
        const { pageMapAst } = (await collectFiles({
          dir: filePath,
          route: fileRoute,
          metaImports,
          dynamicMetaImports
        })) as any
        if (!pageMapAst.elements.length) return

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
          const importName = `meta${metaImports.length}`
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

  return {
    pageMapAst: { type: 'ArrayExpression', elements: items } as any,
    metaImports,
    dynamicMetaImports
  }
}

export async function collectPageMap({
  dir,
  route
}: {
  dir: string
  route: string
}): Promise<string> {
  const { pageMapAst, metaImports, dynamicMetaImports } = await collectFiles({
    dir,
    route
  })

  const metaImportsAST = metaImports.map(({ filePath, importName }) => ({
    type: 'ImportDeclaration',
    source: { type: 'Literal', value: filePath },
    specifiers: [
      {
        type: 'ImportDefaultSpecifier',
        local: { type: 'Identifier', name: importName }
      }
    ]
  })) as any

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [
      ...metaImportsAST,
      createAstExportConst('pageMap', pageMapAst),
      createAstExportConst('dynamicMetaModules', {
        type: 'ObjectExpression',
        properties: dynamicMetaImports.map(({ importName, route }) => ({
          type: 'Property',
          key: { type: 'Literal', raw: `'${route}'` },
          value: { type: 'Identifier', name: importName },
          kind: 'init'
        }))
      })
    ]
  })

  return result.value
}
