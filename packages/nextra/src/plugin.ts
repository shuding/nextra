import path from 'node:path'
import { promisify } from 'node:util'
import fs from 'graceful-fs'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'
import {
  CWD,
  DYNAMIC_META_FILENAME,
  MARKDOWN_EXTENSION_REGEX,
  META_FILENAME
} from './constants'
import type {
  FileMap,
  Folder,
  MdxFile,
  MdxPath,
  MetaJsonFile,
  MetaJsonPath,
  PageMapItem
} from './types'
import {
  isMdxFile,
  isMeta,
  isSerializable,
  logger,
  normalizePageRoute,
  sortPages,
  truthy
} from './utils'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const realpath = promisify(fs.realpath)
const stat = promisify(fs.stat)

export async function collectMdx(
  filePath: string,
  route = ''
): Promise<MdxFile> {
  const { name } = path.parse(filePath)

  const content = await readFile(filePath, 'utf8')
  const { data } = grayMatter(content)
  return {
    name,
    route,
    ...(Object.keys(data).length && { frontMatter: data })
  }
}

const limit = pLimit(20)

export async function collectFiles({
  dir,
  route = '/',
  fileMap = Object.create(null),
  isFollowingSymlink = false
}: {
  dir: string
  route?: string
  fileMap?: FileMap
  isFollowingSymlink?: boolean
}): Promise<{ items: PageMapItem[]; fileMap: FileMap }> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files.map(async f => {
    const filePath = path.join(dir, f.name)
    let isDirectory = f.isDirectory()

    const isSymlinked = isFollowingSymlink || f.isSymbolicLink()
    let symlinkSource: string
    if (isSymlinked) {
      symlinkSource = await realpath(filePath)
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
      const { items } = await collectFiles({
        dir: filePath,
        route: fileRoute,
        fileMap,
        isFollowingSymlink: isSymlinked
      })
      if (!items.length) return
      return {
        name: f.name,
        route: fileRoute,
        children: items
      } satisfies Folder
    }

    // add concurrency because folder can contain a lot of files
    return limit(async () => {
      if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
        // There is no reason to add special `_app` to fileMap
        if (fileRoute === '/_app') return
        const fp = filePath as MdxPath
        fileMap[fp] = await collectMdx(fp, fileRoute)

        if (symlinkSource) {
          fileMap[symlinkSource as MdxPath] = { ...fileMap[fp] }
        }

        return fileMap[fp]
      }

      const fileName = name + ext
      try {
        if (fileName === META_FILENAME) {
          const fp = filePath as MetaJsonPath
          const content = await readFile(fp, 'utf8')
          fileMap[fp] = {
            data: JSON.parse(content)
          }
          return fileMap[fp]
        }

        if (fileName === DYNAMIC_META_FILENAME) {
          // _meta.js file. Need to check if it's dynamic (a function) or not.

          // querystring to disable caching of module
          const importPath = `${filePath}?d=${Date.now()}`
          const metaMod = await import(importPath)
          const meta = metaMod.default
          const fp = filePath.replace(/\.js$/, '.json') as MetaJsonPath

          if (typeof meta === 'function') {
            // Dynamic. Add a special key (__nextra_src) and set data as empty.
            fileMap[fp] = {
              __nextra_src: filePath,
              data: {}
            }
          } else if (meta && typeof meta === 'object' && isSerializable(meta)) {
            // Static content, can be statically optimized.
            fileMap[fp] = {
              // we spread object because default title could be incorrectly set when _meta.json/js
              // is imported/exported by another _meta.js
              data: { ...meta }
            }
          } else {
            logger.error(
              `"${fileName}" is not a valid meta file. The default export is required to be a serializable object or a function. Please check the following file:`,
              path.relative(CWD, filePath)
            )
          }
          return fileMap[fp]
        }
      } catch (error) {
        const relPath = path.relative(CWD, filePath)
        logger.error(
          `Error loading ${relPath}
${(error as Error).name}: ${(error as Error).message}`
        )
      }

      if (fileName === 'meta.json') {
        logger.warn(
          '"meta.json" was renamed to "_meta.json". Rename the following file:',
          path.relative(CWD, filePath)
        )
      } else if (/_meta\.(jsx|ts|tsx|cjs|mjs)$/.test(fileName)) {
        logger.error(
          `"${fileName}" is not currently supported, please rename the following file to "${DYNAMIC_META_FILENAME}":`,
          path.relative(CWD, filePath)
        )
      }
    })
  })

  const items = (await Promise.all(promises)).filter(truthy)

  const mdxPages: MdxFile[] = []
  let metaFile: MetaJsonFile | undefined

  for (const item of items) {
    if (isMdxFile(item)) {
      mdxPages.push(item)
    } else if (isMeta(item)) {
      metaFile = item
    }
  }
  const defaultMeta = sortPages(mdxPages)

  // add `_meta.json` file if it's missing
  if (!metaFile && mdxPages.length > 0) {
    metaFile = {
      data: Object.fromEntries(defaultMeta)
    }
    items.push(metaFile)
  }

  if (metaFile) {
    for (const [key, capitalizedTitle] of defaultMeta) {
      metaFile.data[key] ||= capitalizedTitle
      const metaItem = metaFile.data[key]
      if (typeof metaItem === 'object') {
        metaItem.title ||= capitalizedTitle
      }
    }
  }

  return { items, fileMap }
}
