import path from 'node:path'
import gracefulFs from 'graceful-fs'
// import pkg from 'next/dist/compiled/webpack/webpack.js'
import type { Compiler } from 'webpack'
import { IS_PRODUCTION } from '../../constants'
import { CHUNKS_DIR } from '../constants'
import { PAGES_DIR } from '../file-system'
import { collectPageMap } from '../page-map'
import { logger } from '../utils'

// const { webpack, sources } = pkg
const fs = gracefulFs.promises

let isSaved = false

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const locales = new Set(this.config.locales)

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      // if (isSaved || !IS_PRODUCTION) {
      //   // Never call hook 2 times
      //   // Also on `production` environment we get error:
      //   // Module not found: Can't resolve '.../.next/static/chunks/nextra-page-map-en.mjs'
      //   // while using only `processAssets` hook, but without `beforeCompile`
      //   callback()
      //   return
      // }
      if (IS_PRODUCTION && !isSaved) {
        callback()
        return
      }

      if (!isSaved) {
        // Create chunks directory since it doesn't exist yet
        await fs.mkdir(path.join(CHUNKS_DIR), { recursive: true })
      }

      try {
        for (const locale of locales) {
          const route = `/${locale}`
          const dir = PAGES_DIR + route
          const rawJs = await collectPageMap({ dir, route })

          await fs.writeFile(
            path.join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`),
            rawJs
          )
        }
        logger.info('`beforeCompile`')
        isSaved = true
        callback()
      } catch (error) {
        callback(error as Error)
      }
    })

    // if (IS_PRODUCTION) {
    //   // Do not fire `processAssets` on production
    //   return
    // }

    // compiler.hooks.compilation.tap(pluginName, compilation => {
    //   compilation.hooks.processAssets.tapAsync(
    //     {
    //       name: pluginName,
    //       stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
    //     },
    //     async (assets, callback) => {
    //       try {
    //         // TODO: Find a way to get filename only for current asset? and get PageMap only for it
    //         for (const locale of locales) {
    //           const route = `/${locale}`
    //           const dir = PAGES_DIR + route
    //           const rawJs = await collectPageMap({ dir, route })
    //
    //           const assetPath =
    //             (IS_PRODUCTION ? '../' : '') +
    //             `../static/chunks/nextra-page-map-${locale}.mjs`
    //
    //           assets[assetPath] = new sources.RawSource(rawJs)
    //         }
    //         logger.info('`processAssets`')
    //         callback()
    //       } catch (error) {
    //         callback(error as Error)
    //       }
    //     }
    //   )
    // })
  }
}
