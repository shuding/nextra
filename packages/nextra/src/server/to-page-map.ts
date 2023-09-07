import path from 'node:path'
import { promisify } from 'node:util'
import { toJs } from 'estree-util-to-js'
import { valueToEstree } from 'estree-util-value-to-estree'
import fs from 'graceful-fs'
import pLimit from 'p-limit'
import {
  DYNAMIC_META_FILENAME,
  MARKDOWN_EXTENSION_REGEX,
  META_FILENAME
} from './constants'
import type {
  FileMap,
  Folder,
  MdxFile,
  MdxPath,
  MetaJsonPath,
  PageMapItem
} from './types'
import { isSerializable, normalizePageRoute, truthy } from './utils'
import { logger } from './server/utils'

const readdir = promisify(fs.readdir)
const realpath = promisify(fs.realpath)
const stat = promisify(fs.stat)

const limit = pLimit(20)

type Import = { filePath: string; importName: string }

async function collectFiles({
  dir,
  route = '/',
  fileMap = Object.create(null),
  // isFollowingSymlink = false,
  metaImports = [],
  frontMatterImports = []
}: {
  dir: string
  route?: string
  fileMap?: FileMap
  isFollowingSymlink?: boolean
  metaImports?: Import[]
  frontMatterImports?: Import[]
}): Promise<{
  items: PageMapItem[]
  fileMap: FileMap
  metaImports: Import[]
  frontMatterImports: Import[]
}> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files.map(async f => {
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
        frontMatterImports
      })) as any
      if (!items.elements.length) return

      const folder = valueToEstree({
        kind: 'Folder',
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
        const importName = `frontMatter${frontMatterImports.length}`
        frontMatterImports.push({ filePath, importName })
        return {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'kind' },
              value: { type: 'Literal', value: 'MdxPage' },
              kind: 'init'
            },
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
              value: { type: 'Identifier', name: importName },
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
              key: { type: 'Identifier', name: 'kind' },
              value: { type: 'Literal', value: 'Meta' },
              kind: 'init'
            },
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
        // // _meta.js file. Need to check if it's dynamic (a function) or not.
        //
        // // querystring to disable caching of module
        // const importPath = `${filePath}?d=${Date.now()}`
        // const metaMod = await import(importPath)
        // const meta = metaMod.default
        // const fp = filePath.replace(/\.js$/, '.json') as MetaJsonPath
        //
        // if (typeof meta === 'function') {
        //   // Dynamic. Add a special key (__nextra_src) and set data as empty.
        //   return {
        //     kind: 'Meta',
        //     __nextra_src: filePath,
        //     data: {}
        //   }
        // } else if (meta && typeof meta === 'object' && isSerializable(meta)) {
        //   // Static content, can be statically optimized.
        //   return {
        //     kind: 'Meta',
        //     // we spread object because default title could be incorrectly set when _meta.json/js
        //     // is imported/exported by another _meta.js
        //     data: { ...meta }
        //   }
        // } else {
        //   logger.error(
        //     `"${fileName}" is not a valid meta file. The default export is required to be a serializable object or a function. Please check the following file:`,
        //     path.relative(CWD, filePath)
        //   )
        // }
        // return fileMap[fp]
      }
    })
  })

  const items = (await Promise.all(promises)).filter(truthy)

  return {
    items: { type: 'ArrayExpression', elements: items } as any,
    fileMap,
    metaImports,
    frontMatterImports
  }
}

export async function toPageMap({
  dir
}: {
  dir: string
}): Promise<{ rawJs: string; fileMap: FileMap }> {
  const { items, metaImports, frontMatterImports, fileMap } =
    await collectFiles({ dir })

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

  const frontMatterImportsAST = frontMatterImports.map(
    ({ filePath, importName }) => ({
      type: 'ImportDeclaration',
      specifiers: [
        {
          type: 'ImportSpecifier',
          imported: { type: 'Identifier', name: 'frontMatter' },
          local: { type: 'Identifier', name: importName }
        }
      ],
      source: { type: 'Literal', value: filePath }
    })
  ) as any

  const result = toJs({
    type: 'Program',
    sourceType: 'module',
    body: [
      ...metaImportsAST,
      ...frontMatterImportsAST,
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
      }
    ]
  })

  return {
    fileMap,
    rawJs: result.value
  }
}
