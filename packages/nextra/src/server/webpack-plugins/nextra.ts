import { join } from 'node:path'
import gracefulFs from 'graceful-fs'
import pkg from 'next/dist/compiled/webpack/webpack.js'
import type { Compiler } from 'webpack'
import { IS_PRODUCTION } from '../../constants'
import { CHUNKS_DIR } from '../constants'
import { PAGES_DIR } from '../file-system'
import { collectPageMap } from '../page-map'
import { logger } from '../utils'

const { webpack, sources } = pkg
const fs = gracefulFs.promises

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const locales = new Set(this.config.locales)

    compiler.hooks.compilation.tap(pluginName, (compilation, params) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        async (assets, callback) => {
          const lastPage = Object.keys(assets).findLast(assetPath =>
            assetPath.startsWith('pages/')
          )

          const lastLocale = lastPage ? lastPage.split('/')[1] : ''
          const allLocales = locales.has(lastLocale) ? [lastLocale] : locales

          try {
            for (const locale of allLocales) {
              const route = `/${locale}`
              const dir = PAGES_DIR + route

              const rawJs = await collectPageMap({ dir, route })

              const prev = await fs
                .readFile(
                  join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`),
                  'utf8'
                )
                .catch(() => '')
              if (prev === rawJs) continue

              const assetPath =
                (IS_PRODUCTION ? '../' : '') +
                `../static/chunks/nextra-page-map-${locale}.mjs`
              assets[assetPath] ||= new sources.RawSource(rawJs)

              logger.info(`PageMap "nextra-page-map-${locale}.mjs" saved`)
            }
            callback()
          } catch (error) {
            callback(error as Error)
          }
        }
      )
    })
  }
}
