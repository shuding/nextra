import { join } from 'node:path'
import pkg from 'graceful-fs'
import type { Compiler } from 'webpack'
import { CHUNKS_DIR } from '../constants'
import { PAGES_DIR } from '../file-system'
import { toPageMap } from '../server/to-page-map'

const fs = pkg.promises

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales } = this.config

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      try {
        for (const locale of locales) {
          const route = `/${locale}`
          const rawJs = await toPageMap({
            dir: PAGES_DIR + route,
            route
          })

          await fs.mkdir(join(CHUNKS_DIR), { recursive: true })
          await fs.writeFile(
            join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`),
            rawJs
          )
        }
        callback()
      } catch (error) {
        console.error(error)
        callback(error as Error)
      }
    })
  }
}
