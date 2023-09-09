import { join, relative } from 'node:path'
import fs from 'graceful-fs'
import pkg from 'next/dist/compiled/webpack/webpack.js'
import type { Compiler } from 'webpack'
import { CHUNKS_DIR, CWD } from '../constants'
import { PAGES_DIR } from '../file-system'
import { collectPageMap } from '../page-map'
import { logger } from '../utils'

const { webpack } = pkg

let isSaved = false

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales } = this.config

    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        async () => {
          if (isSaved) {
            logger.warn('PageMap is already saved, skipping…')
            return
          }
          const label = 'Done in'
          console.time(label)

          for (const locale of locales) {
            const route = `/${locale}`
            const dir = PAGES_DIR + route

            const rawJs = await collectPageMap({ dir, route })

            const pageMapPath = join(
              CHUNKS_DIR,
              `nextra-page-map-${locale}.mjs`
            )
            // TODO: Improve this, this a temporal workaround to make things works
            //  Saving with fs is not ideal, we should attach to webpack's assets object
            await fs.promises.writeFile(pageMapPath, rawJs)

            // const pageMapPath =
            //   (IS_PRODUCTION ? '../' : '') +
            //   `../static/chunks/nextra-page-map-${locale}.mjs`
            // assets[pageMapPath] = new sources.RawSource(rawJs)

            logger.info(`PageMap "${relative(CWD, pageMapPath)}" saved`)
          }

          isSaved = true
          console.timeEnd(label)
        }
      )
    })
  }
}
