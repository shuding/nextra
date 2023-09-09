import { join, relative } from 'node:path'
import pkg from 'graceful-fs'
import type { Compiler } from 'webpack'
import { CHUNKS_DIR, CWD } from '../constants'
import { PAGES_DIR } from '../file-system'
import { collectPageMap } from '../page-map'
import { logger } from '../utils'

const fs = pkg.promises

// let isSaved = false

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales } = this.config

    // TODO: Improve this, this a temporal workaround to make things works
    //  Saving with fs is not ideal, we should attach to webpack's assets objects
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      // if (isSaved) {
      //   console.warn('PageMap is already saved, skipping…')
      //   callback()
      // }
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

          logger.info(`PageMap "${relative(CWD, pageMapPath)}" saved`)
        }

        console.timeEnd(label)
        // isSaved = true
        callback()
      } catch (error) {
        console.error(error)
        callback(error as Error)
      }
    })
  }
}
