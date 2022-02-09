import { PageMapItem } from './types'
const { readdir, readFile } = fs
import fs from 'graceful-fs'
import util from 'util'
import { getLocaleFromFilename, parseJsonFile, removeExtension } from './utils'
import path from 'path'
import slash from 'slash'
import grayMatter from 'gray-matter'
import { extension, findPagesDir, metaExtension } from './page-map'
import { Compiler } from 'webpack'
import { restoreCache } from './content-dump'

export async function collectFiles(
  dir: string,
  route: string = '/',
  fileMap: Record<string, any> = {}
): Promise<{ items: PageMapItem[]; fileMap: Record<string, any> }> {
  const files = await util.promisify(readdir)(dir, { withFileTypes: true })

  const items = (
    await Promise.all(
      files.map(async f => {
        const filePath = path.resolve(dir, f.name)
        const fileRoute = slash(
          path.join(route, removeExtension(f.name).replace(/^index$/, ''))
        )

        if (f.isDirectory()) {
          if (fileRoute === '/api') return null
          const { items: children } = await collectFiles(
            filePath,
            fileRoute,
            fileMap
          )
          if (!children || !children.length) return null
          return {
            name: f.name,
            children,
            route: fileRoute
          }
        } else if (extension.test(f.name)) {
          const locale = getLocaleFromFilename(f.name)
          const fileContents = await util.promisify(readFile)(filePath, 'utf-8')
          const { data } = grayMatter(fileContents)
          if (Object.keys(data).length) {
            fileMap[filePath] = {
              name: removeExtension(f.name),
              route: fileRoute,
              frontMatter: data,
              locale
            }
            return fileMap[filePath]
          }
          fileMap[filePath] = {
            name: removeExtension(f.name),
            route: fileRoute,
            locale
          }
          return fileMap[filePath]
        } else if (metaExtension.test(f.name)) {
          const content = await util.promisify(readFile)(filePath, 'utf-8')
          const meta = parseJsonFile(content, filePath)
          // @ts-expect-error since metaExtension.test(f.name) === true
          const locale = f.name.match(metaExtension)[1]
          fileMap[filePath] = {
            name: 'meta.json',
            meta,
            locale
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

export class PageMapCache {
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

class NextraPlugin {
  config: any
  constructor(nextraConfig: any) {
    this.config = nextraConfig
  }
  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'NextraPlugin',
      async (_, callback) => {
        if (this.config && this.config.unstable_contentDump) {
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

export { NextraPlugin }
