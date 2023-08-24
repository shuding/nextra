import type { Compiler } from 'webpack'
import { PAGES_DIR } from '../file-system'
import { pageMapCache } from '../page-map'
import { collectFiles } from '../plugin'
import type { NextraConfig } from '../types'

export class NextraPlugin {
  constructor(private config: NextraConfig & { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      const { locales } = this.config
      try {
        const result = await collectFiles({ dir: PAGES_DIR, locales })
        pageMapCache.set(result)
        callback()
      } catch (err) {
        callback(err as Error)
      }
    })
  }
}
