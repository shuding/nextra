import fs from 'node:fs/promises'
import path from 'node:path'
import type { Compiler } from 'webpack'
import type { NextraConfig } from '../../types'
import { CWD, IS_PRODUCTION } from '../constants.js'
import { APP_DIR } from '../file-system.js'
import {
  generatePageMapFromFilepaths,
  getFilepaths
} from '../generate-page-map.js'
import { collectPageMap } from '../page-map.js'

let isSaved = false

const CHUNKS_DIR = path.join(CWD, '.next', 'static', 'chunks')

export class NextraPlugin {
  constructor(
    private config: {
      locales: string[]
      transformPageMap?: NextraConfig['transformPageMap']
      useContentDir?: NextraConfig['useContentDir']
    }
  ) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales, useContentDir } = this.config

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
          const relativePaths = await getFilepaths({
            dir: useContentDir ? path.join('content', locale) : APP_DIR,
            isAppDir: !useContentDir
          })

          const { pageMap, mdxPages } =
            generatePageMapFromFilepaths(relativePaths)
          const rawJs = await collectPageMap({
            locale,
            pageMap,
            mdxPages,
            fromAppDir: !useContentDir
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
