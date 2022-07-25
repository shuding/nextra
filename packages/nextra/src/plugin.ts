import { NextraConfig, PageMapItem, NextraPluginCache } from './types'
import fs from 'graceful-fs'
import { promisify } from 'util'
import { parseFileName, parseJsonFile } from './utils'
import path from 'path'
import slash from 'slash'
import grayMatter from 'gray-matter'
import { findPagesDir } from './page-map'
import { Compiler } from 'webpack'
import { restoreCache } from './content-dump'
import { MARKDOWN_EXTENSION_REGEX } from './constants'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

export const collectMdx = async (filePath: string, route = '') => {
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
  fileMap: Record<string, any> = {}
): Promise<{ items: PageMapItem[]; fileMap: Record<string, any> }> {
  const files = await readdir(dir, { withFileTypes: true })

  const items = (
    await Promise.all(
      files.map(async f => {
        const filePath = path.resolve(dir, f.name)
        const { name, locale, ext } = parseFileName(filePath)
        const fileRoute = slash(path.join(route, name.replace(/^index$/, '')))

        if (f.isDirectory()) {
          if (fileRoute === '/api') return
          const { items } = await collectFiles(filePath, fileRoute, fileMap)
          if (!items.length) return
          return {
            name: f.name,
            children: items,
            route: fileRoute
          }
        }

        if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
          fileMap[filePath] = await collectMdx(filePath, fileRoute)
          return fileMap[filePath]
        }

        if (ext === '.json' && name === 'meta') {
          const content = await readFile(filePath, 'utf8')
          fileMap[filePath] = {
            name: 'meta.json',
            locale,
            meta: parseJsonFile(content, filePath)
          }
          return fileMap[filePath]
        }
      })
    )
  ).filter(Boolean)

  return {
    items,
    fileMap
  }
}

class PageMapCache implements NextraPluginCache {
  public cache: { items: PageMapItem[]; fileMap: Record<string, any> } | null

  constructor() {
    this.cache = { items: [], fileMap: {} }
  }

  set(data: { items: PageMapItem[]; fileMap: Record<string, any> }) {
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

        const result = await collectFiles(
          path.join(process.cwd(), findPagesDir()),
          '/'
        )
        pageMapCache.set(result)
        callback()
      }
    )
  }
}
