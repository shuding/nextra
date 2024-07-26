import path from 'node:path'
import gracefulFs from 'graceful-fs'
import type { Compiler } from 'webpack'
import type { NextraConfig } from '../../types'
import { CHUNKS_DIR, IS_PRODUCTION } from '../constants.js'
import { PAGES_DIR } from '../file-system.js'
import { collectPageMap } from '../page-map.js'

const fs = gracefulFs.promises

let isSaved = false

export class NextraPlugin {
  constructor(
    private config: {
      locales: string[]
      transformPageMap?: NextraConfig['transformPageMap']
    }
  ) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales, transformPageMap } = this.config

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      if (IS_PRODUCTION && isSaved) {
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
          const dir = path.join(PAGES_DIR, locale)
          const rawJs = await collectPageMap({
            dir,
            route,
            locale,
            transformPageMap
          })

          await fs.writeFile(
            path.join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`),
            rawJs
          )
        }
        isSaved = true
        callback()
      } catch (error) {
        callback(error as Error)
      }
    })
  }
}
