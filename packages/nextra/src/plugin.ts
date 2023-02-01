import type { Compiler } from 'webpack'
import type { NextraConfig, FileMap, PageMapItem } from './types'
import { PAGES_DIR } from './file-system'
import { collectFiles } from './collect-files'

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
