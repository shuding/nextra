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
import type {
  Folder,
  MdxFile,
  MdxPath,
  MetaJsonPath,
  PageMapItem
} from '../types'
import { normalizePageRoute, truthy } from '../utils'
import { logger } from './utils'

const readdir = promisify(fs.readdir)
const realpath = promisify(fs.realpath)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

const limit = pLimit(1)

type Import = { filePath: string; importName: string }
type DynamicImport = { importName: string; route: string }

function createAstObject(obj: Record<string, unknown>) {
  return {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([key, value]) => ({
      type: 'Property',
      kind: 'init',
      key: { type: 'Identifier', name: key },
      value:
        ['string', 'number', 'boolean'].includes(typeof value) || value === null
          ? { type: 'Literal', value }
          : value
    }))
  }
}

async function collectFiles({
  dir,
  route = '/',
  // isFollowingSymlink = false,
  metaImports = [],
  dynamicMetaImports = []
}: {
  dir: string
  route?: string
  isFollowingSymlink?: boolean
  metaImports?: Import[]
  dynamicMetaImports?: DynamicImport[]
}): Promise<{
  items: PageMapItem[]
  metaImports: Import[]
  dynamicMetaImports: DynamicImport[]
}> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files.map(async (f, _index, array) => {
    const filePath = path.join(dir, f.name)
    const isDirectory = f.isDirectory()

    // const isSymlinked = isFollowingSymlink || f.isSymbolicLink()
    // let symlinkSource: string
    // if (isSymlinked) {
    //   symlinkSource = await realpath(filePath)
    //   const stats = await stat(filePath)
    //   if (stats.isDirectory()) {
    //     isDirectory = true
    //   }
    // }

    const { name, ext } = path.parse(filePath)
    // We need to filter out dynamic routes, because we can't get all the
    // paths statically from here — they'll be generated separately.
    if (name.startsWith('[')) return

    const fileRoute = normalizePageRoute(route, name)

    if (isDirectory) {
      if (fileRoute === '/api') return
      const { items } = (await collectFiles({
        dir: filePath,
        route: fileRoute,
        // isFollowingSymlink: isSymlinked,
        metaImports,
        dynamicMetaImports
      })) as any
      if (!items.elements.length) return

      return createAstObject({
        name: f.name,
        route: fileRoute,
        children: items
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
          frontMatter: valueToEstree(data)
        })
      }

      const fileName = name + ext
      if (fileName === META_FILENAME) {
        const importName = `meta${metaImports.length}`
        metaImports.push({ filePath, importName })

        return createAstObject({
          data: { type: 'Identifier', name: importName }
        })
      }

      if (META_REGEX.test(fileName)) {
        const dynamicPage = array.find(f => f.name.startsWith('['))
        const importName = `meta${metaImports.length}`
        metaImports.push({ filePath, importName })

        if (dynamicPage) {
          dynamicMetaImports.push({ importName, route })
          return createAstObject({ data: createAstObject({}) })
        }
        return createAstObject({
          data: { type: 'Identifier', name: importName }
        })
      }
    })
  })

  const items = (await Promise.all(promises)).filter(truthy)

  return {
    items: { type: 'ArrayExpression', elements: items } as any,
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
  const { items, metaImports, dynamicMetaImports } = await collectFiles({
    dir,
    route
  })

  const metaImportsAST = metaImports.map(({ filePath, importName }) => ({
    type: 'ImportDeclaration',
    specifiers: [
      {
        type: 'ImportDefaultSpecifier',
        local: { type: 'Identifier', name: importName }
      }
    ],
    source: { type: 'Literal', value: filePath }
  })) as any

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [
      ...metaImportsAST,
      {
        type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {
          type: 'VariableDeclaration',
          kind: 'const',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'pageMap' },
              init: items as any
            }
          ]
        }
      },
      {
        type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {
          type: 'VariableDeclaration',
          kind: 'const',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'dynamicMetaModules' },
              init: {
                type: 'ObjectExpression',
                properties: dynamicMetaImports.map(({ importName, route }) => ({
                  type: 'Property',
                  key: { type: 'Literal', raw: `'${route}'` },
                  value: { type: 'Identifier', name: importName },
                  kind: 'init'
                }))
              }
            }
          ]
        }
      }
    ]
  })

  return result.value
}
