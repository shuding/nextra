import type { PageMapItem } from './types'
import type { Compiler } from 'webpack'
import type { LimitFunction } from 'p-limit'

import fs from 'graceful-fs'
import util from 'util'
import path from 'path'
import slash from 'slash'
import grayMatter from 'gray-matter'

import { getLocaleFromFilename, parseJsonFile, removeExtension } from './utils'
import { extension, findPagesDir, metaExtension } from './page-map'
import { restoreCache } from './content-dump'

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

let pLimit: (limit: number) => LimitFunction
let limitFsReads: LimitFunction

const frontMatterCache = new Map<string, any>()

async function collectFilesImpl(
  dir: string,
  route: string = '/',
  fileMap: Record<string, any> = {}
): Promise<{ items: PageMapItem[]; fileMap: Record<string, any> }> {
  const files = await readdir(dir, { withFileTypes: true })

  const items = (
    await Promise.all(
      files.map(async f => {
        const filePath = path.resolve(dir, f.name)
        const fileRoute = slash(
          path.join(route, removeExtension(f.name).replace(/^index$/, ''))
        )

        if (f.isDirectory()) {
          if (fileRoute === '/api') return null
          const { items: children } = await collectFilesImpl(
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

          if (!frontMatterCache.has(filePath)) {
            const { data } = grayMatter(
              await limitFsReads(() => readFile(filePath, 'utf-8'))
            )
            frontMatterCache.set(filePath, data)
          }

          const data = frontMatterCache.get(filePath)
          const frontMatterData: { frontMatter?: any } = {}
          if (Object.keys(data).length) {
            frontMatterData.frontMatter = data
          }

          fileMap[filePath] = {
            name: removeExtension(f.name),
            route: fileRoute,
            locale,
            ...frontMatterData
          }

          return fileMap[filePath]
        } else if (metaExtension.test(f.name)) {
          const content = await limitFsReads(() => readFile(filePath, 'utf-8'))
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

let concurrentFilesCollector: null | Promise<any> = null

export async function collectFiles(
  dir: string,
  route: string = '/',
  fileMap: Record<string, any> = {},
  invalidateFile: string | null = null
): Promise<{ items: PageMapItem[]; fileMap: Record<string, any> }> {
  if (!pLimit) {
    pLimit = (await import('p-limit')).default
  }
  if (!limitFsReads) {
    limitFsReads = pLimit(60)
  }

  if (invalidateFile) {
    frontMatterCache.delete(invalidateFile)
  }

  if (concurrentFilesCollector) {
    return concurrentFilesCollector
  }

  return (concurrentFilesCollector = collectFilesImpl(dir, route, fileMap).then(
    result => {
      pageMapCache.set(result)
      concurrentFilesCollector = null
      return result
    }
  ))
}

export class PageMapCache {
  public cache: { items: PageMapItem[]; fileMap: Record<string, any> } | null
  constructor() {
    this.cache = null
  }
  set(data: { items: PageMapItem[]; fileMap: Record<string, any> }) {
    this.cache = this.cache || { items: [], fileMap: {} }
    this.cache.items = data.items
    this.cache.fileMap = data.fileMap
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
        if (this.config && this.config.unstable_flexsearch) {
          // Restore the search data from the cache.
          restoreCache()
        }

        if (!pageMapCache.get()) {
          await collectFiles(path.join(process.cwd(), findPagesDir()), '/')
        }

        callback()
      }
    )
  }
}

export { NextraPlugin }
