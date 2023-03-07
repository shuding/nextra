import type { Compiler } from 'webpack'
import type {
  NextraConfig,
  FileMap,
  MdxPath,
  MetaJsonPath,
  PageMapItem,
  Folder,
  MdxFile,
  MetaJsonFile
} from './types'
import fs from 'graceful-fs'
import { promisify } from 'node:util'
import {
  isSerializable,
  normalizePageRoute,
  parseFileName,
  sortPages,
  truthy
} from './utils'
import path from 'node:path'
import grayMatter from 'gray-matter'
import pLimit from 'p-limit'

import {
  CWD,
  DEFAULT_LOCALES,
  DYNAMIC_META_FILENAME,
  MARKDOWN_EXTENSION_REGEX,
  META_FILENAME
} from './constants'
import { PAGES_DIR } from './file-system'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

export const collectMdx = async (
  filePath: string,
  route = ''
): Promise<MdxFile> => {
  const { name, locale } = parseFileName(filePath)

  const content = await readFile(filePath, 'utf8')
  const { data } = grayMatter(content)
  return {
    kind: 'MdxPage',
    name,
    route,
    ...(locale && { locale }),
    ...(Object.keys(data).length && { frontMatter: data })
  }
}

const limit = pLimit(20)

export async function collectFiles(
  dir: string,
  locales = DEFAULT_LOCALES,
  route = '/',
  fileMap: FileMap = Object.create(null)
): Promise<{ items: PageMapItem[]; fileMap: FileMap }> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files.map(async f => {
    const filePath = path.join(dir, f.name)
    const isDirectory = f.isDirectory()
    const { name, locale, ext } = isDirectory
      ? // directory couldn't have extensions
        { name: path.basename(filePath), locale: '', ext: '' }
      : parseFileName(filePath)
    const fileRoute = normalizePageRoute(route, name)

    if (isDirectory) {
      if (fileRoute === '/api') return
      const { items } = await collectFiles(
        filePath,
        locales,
        fileRoute,
        fileMap
      )
      if (!items.length) return
      return <Folder>{
        kind: 'Folder',
        name: f.name,
        route: fileRoute,
        children: items
      }
    }

    // add concurrency because folder can contain a lot of files
    return limit(async () => {
      if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
        // We need to filter out dynamic routes, because we can't get all the
        // paths statically from here — they'll be generated separately.
        if (name.startsWith('[')) return
        // There is no reason to add special `_app` to fileMap
        if (fileRoute === '/_app') return
        const fp = filePath as MdxPath
        fileMap[fp] = await collectMdx(fp, fileRoute)
        return fileMap[fp]
      }

      const fileName = name + ext

      if (fileName === META_FILENAME) {
        const fp = filePath as MetaJsonPath
        const content = await readFile(fp, 'utf8')
        fileMap[fp] = {
          kind: 'Meta',
          ...(locale && { locale }),
          data: JSON.parse(content)
        }
        return fileMap[fp]
      }

      if (fileName === DYNAMIC_META_FILENAME) {
        // _meta.js file. Need to check if it's dynamic (a function) or not.
        const metaMod = await import(filePath)
        const meta = metaMod.default
        const fp = filePath.replace(/\.js$/, '.json') as MetaJsonPath

        if (typeof meta === 'function') {
          // Dynamic. Add a special key (__nextra_src) and set data as empty.
          fileMap[fp] = {
            kind: 'Meta',
            ...(locale && { locale }),
            __nextra_src: filePath,
            data: {}
          }
        } else if (meta && typeof meta === 'object' && isSerializable(meta)) {
          // Static content, can be statically optimized.
          fileMap[fp] = {
            kind: 'Meta',
            ...(locale && { locale }),
            data: meta
          }
        } else {
          console.error(
            `[nextra] "${fileName}" is not a valid meta file. The default export is required to be a serializable object or a function. Please check the following file:`,
            path.relative(CWD, filePath)
          )
        }
        return fileMap[fp]
      }

      if (fileName === 'meta.json') {
        console.warn(
          '[nextra] "meta.json" was renamed to "_meta.json". Rename the following file:',
          path.relative(CWD, filePath)
        )
      } else if (/_meta\.(jsx|ts|tsx|cjs|mjs)$/.test(fileName)) {
        console.error(
          `[nextra] "${fileName}" is not currently supported, please rename the following file to "${DYNAMIC_META_FILENAME}":`,
          path.relative(CWD, filePath)
        )
      }
    })
  })

  const items = (await Promise.all(promises)).filter(truthy)

  const mdxPages: MdxFile[] = []
  const metaLocaleIndexes = new Map<string, number>()

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'MdxPage') {
      mdxPages.push(item)
    } else if (item.kind === 'Meta') {
      // It is possible that it doesn't have a locale suffixed, we use '' here.
      metaLocaleIndexes.set(item.locale || '', i)
    }
  }

  // In the current level, find the corresponding meta file for each locale and
  // extend the fallback meta data we get from the file system.
  for (const locale of locales) {
    let metaIndex = metaLocaleIndexes.get(locale)

    const defaultMeta = sortPages(mdxPages, locale)

    const metaFilename = locale
      ? META_FILENAME.replace('.', `.${locale}.`)
      : META_FILENAME

    const metaPath = path.join(dir, metaFilename) as MetaJsonPath

    if (metaIndex === undefined && defaultMeta.length > 0) {
      // Create a new meta file if it doesn't exist.
      const meta = {
        kind: 'Meta' as const,
        ...(locale && { locale }),
        data: Object.fromEntries(defaultMeta)
      }
      fileMap[metaPath] = meta
      items.push(meta)
      metaIndex = items.length - 1
    }

    if (metaIndex !== undefined) {
      // Fill with the fallback. Note that we need to keep the original order.
      const meta = { ...items[metaIndex] } as MetaJsonFile
      for (const [key, capitalizedTitle] of defaultMeta) {
        meta.data[key] ||= capitalizedTitle
        const metaItem = meta.data[key]
        if (typeof metaItem === 'object') {
          metaItem.title ||= capitalizedTitle
        }
      }
      fileMap[metaPath] = meta
      items[metaIndex] = meta
    }
  }

  return { items, fileMap }
}

export class PageMapCache {
  cache: {
    items: PageMapItem[]
    fileMap: FileMap
  } | null = {
    items: [],
    fileMap: Object.create(null)
  }

  set(data: { items: PageMapItem[]; fileMap: FileMap }) {
    this.cache!.items = data.items
    this.cache!.fileMap = data.fileMap
  }

  clear() {
    this.cache = null
  }

  get() {
    return this.cache
  }
}

export const pageMapCache = new PageMapCache()

export class NextraPlugin {
  constructor(private config: NextraConfig & { locales: string[] }) {}

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'NextraPlugin',
      async (_, callback) => {
        const { locales } = this.config
        try {
          const result = await collectFiles(PAGES_DIR, locales)
          pageMapCache.set(result)
          callback()
        } catch (err) {
          callback(err as Error)
        }
      }
    )
  }
}
