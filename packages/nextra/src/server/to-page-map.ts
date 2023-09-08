import path from 'node:path'
import { promisify } from 'node:util'
import { toJs } from 'estree-util-to-js'
import { valueToEstree } from 'estree-util-value-to-estree'
import fs from 'graceful-fs'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'
import {
  DYNAMIC_META_FILENAME,
  MARKDOWN_EXTENSION_REGEX,
  META_FILENAME
} from '../constants'
import type {
  FileMap,
  Folder,
  MdxFile,
  MdxPath,
  MetaJsonPath,
  PageMapItem
} from '../types'
import { isSerializable, normalizePageRoute, truthy } from '../utils'
import { logger } from './utils'

const readdir = promisify(fs.readdir)
const realpath = promisify(fs.realpath)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

const limit = pLimit(20)

type Import = { filePath: string; importName: string }
type DynamicImport = { importName: string; route: string }

async function collectFiles({
  dir,
  route = '/',
  fileMap = Object.create(null),
  // isFollowingSymlink = false,
  metaImports = [],
  dynamicMetaImports = []
}: {
  dir: string
  route?: string
  fileMap?: FileMap
  isFollowingSymlink?: boolean
  metaImports?: Import[]
  dynamicMetaImports?: DynamicImport[]
}): Promise<{
  items: PageMapItem[]
  fileMap: FileMap
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
        fileMap,
        // isFollowingSymlink: isSymlinked,
        metaImports,
        dynamicMetaImports
      })) as any
      if (!items.elements.length) return

      const folder = valueToEstree({
        name: f.name,
        route: fileRoute
      }) as any

      folder.properties.push({
        type: 'Property',
        key: { type: 'Identifier', name: 'children' },
        value: items,
        kind: 'init'
      })

      return folder
    }

    // add concurrency because folder can contain a lot of files
    return limit(async () => {
      if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
        const content = await readFile(filePath, 'utf8')
        const { data } = grayMatter(content)
        return {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'name' },
              value: { type: 'Literal', value: path.parse(filePath).name },
              kind: 'init'
            },
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'route' },
              value: { type: 'Literal', value: fileRoute },
              kind: 'init'
            },
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'frontMatter' },
              value: valueToEstree(data),
              kind: 'init'
            }
          ]
        }
      }

      const fileName = name + ext
      if (fileName === META_FILENAME) {
        const importName = `meta${metaImports.length}`
        metaImports.push({ filePath, importName })

        return {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'data' },
              value: { type: 'Identifier', name: importName },
              kind: 'init'
            }
          ]
        }
      }

      if (fileName === DYNAMIC_META_FILENAME) {
        const dynamicPage = array.find(f => f.name.startsWith('['))
        const importName = `meta${metaImports.length}`
        metaImports.push({ filePath, importName })

        if (dynamicPage) {
          console.log()
          dynamicMetaImports.push({ importName, route })
          return {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { type: 'Identifier', name: 'data' },
                value: { type: 'ObjectExpression', properties: [] },
                kind: 'init'
              }
            ]
          }
        }
        return {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'data' },
              value: { type: 'Identifier', name: importName },
              kind: 'init'
            }
          ]
        }
      }
    })
  })

  const items = (await Promise.all(promises)).filter(truthy)

  return {
    items: { type: 'ArrayExpression', elements: items } as any,
    fileMap,
    metaImports,
    dynamicMetaImports
  }
}

export async function toPageMap({
  dir,
  route
}: {
  dir: string
  route: string
}): Promise<{ rawJs: string; fileMap: FileMap }> {
  const { items, metaImports, fileMap, dynamicMetaImports } =
    await collectFiles({ dir, route })

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
                  key: { type: 'Literal', raw: `'${route}'`  },
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

  return {
    fileMap,
    rawJs: result.value
  }
}
