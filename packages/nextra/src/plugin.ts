import {
  NextraConfig,
  FileMap,
  MdxPath,
  MetaJsonPath,
  PageMapItem,
  Folder,
  MdxFile
} from './types'
import fs from 'graceful-fs'
import { promisify } from 'util'
import { parseFileName, parseJsonFile, truthy } from './utils'
import path from 'path'
import slash from 'slash'
import grayMatter from 'gray-matter'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import { Compiler } from 'webpack'

import { restoreCache } from './content-dump'
import { CWD, MARKDOWN_EXTENSION_REGEX, META_FILENAME } from './constants'

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
    name,
    route,
    locale,
    ...(Object.keys(data).length && { frontMatter: data })
  }
}

export async function collectFiles(
  dir: string,
  route = '/',
  fileMap: FileMap = Object.create(null)
): Promise<{ items: PageMapItem[]; fileMap: FileMap }> {
  const files = await readdir(dir, { withFileTypes: true })

  const items = await Promise.all(
    files.map(async f => {
      const filePath = path.resolve(dir, f.name)
      const { name, locale, ext } = parseFileName(filePath)
      const fileRoute = slash(path.join(route, name.replace(/^index$/, '')))

      if (f.isDirectory()) {
        if (fileRoute === '/api') return
        const { items } = await collectFiles(filePath, fileRoute, fileMap)
        if (!items.length) return
        return <Folder>{
          name: f.name,
          route: fileRoute,
          children: items
        }
      }

      if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
        const fp = filePath as MdxPath
        fileMap[fp] = await collectMdx(fp, fileRoute)
        return fileMap[fp]
      }
      const fileName = name + ext

      if (fileName === META_FILENAME) {
        const fp = filePath as MetaJsonPath
        const content = await readFile(fp, 'utf8')
        fileMap[fp] = {
          name: META_FILENAME,
          locale,
          meta: parseJsonFile(content, fp)
        }
        return fileMap[fp]
      }

      if (fileName === 'meta.json') {
        console.warn(
          `[nextra] "meta.json" was renamed to "_meta.json". Rename the following file:`,
          path.relative(CWD, filePath)
        )
      }
    })
  )

  return {
    items: items.filter(truthy),
    fileMap
  }
}

export class PageMapCache {
  cache: { items: PageMapItem[]; fileMap: FileMap } | null = {
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
  constructor(private config: NextraConfig) {}

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'NextraPlugin',
      async (_, callback) => {
        if (this.config?.unstable_flexsearch) {
          // Restore the search data from the cache.
          restoreCache()
        }
        const result = await collectFiles(findPagesDir(CWD).pages, '/')
        pageMapCache.set(result)
        callback()
      }
    )
  }
}
