import { join } from 'node:path'
import pkg from 'graceful-fs'
import type { Compiler } from 'webpack'
import { CHUNKS_DIR } from '../constants'
import { PAGES_DIR } from '../file-system'
import { collectPageMap } from '../server/page-map'

const fs = pkg.promises

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales } = this.config

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      try {
        const label = 'Done in'
        console.time(label)
        await fs.mkdir(join(CHUNKS_DIR), { recursive: true })
        for (const locale of locales) {
          const route = `/${locale}`
          const dir = PAGES_DIR + route
          const rawJs = await collectPageMap({ dir, route })
          const pageMapPath = join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`)
          await fs.writeFile(pageMapPath, rawJs)
          console.log(`✅ ${pageMapPath} saved`)
        }
        console.timeEnd(label)
        callback()
      } catch (error) {
        console.error(error)
        callback(error as Error)
      }
    })
  }
}
