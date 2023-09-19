import { createRequire } from 'node:module'
import type { Compiler } from 'webpack'
import type { SearchData } from '../../types'
import { IS_PRODUCTION } from '../constants.js'

const require = createRequire(import.meta.url)

const pkg = require('next/dist/compiled/webpack/webpack.js')
pkg.init()

const { sources, webpack } =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  pkg as typeof import('next/dist/compiled/webpack/webpack.js')

export class NextraSearchPlugin {
  apply(compiler: Compiler) {
    const pluginName = this.constructor.name

    compiler.hooks.make.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        assets => {
          const indexFiles: Record<string, SearchData> = {}

          for (const entry of compilation.entries.values()) {
            const entryDependency = entry.dependencies?.[0]

            // There are some Next.js refactors that might cause the MDX module
            // to be a dependency of the entry module, instead of the entry
            // itself. This is a workaround to find the MDX module loaded by
            // Nextra
            let entryModule =
              compilation.moduleGraph.getResolvedModule(entryDependency)
            if (entryModule && !entryModule.buildInfo?.nextraSearch) {
              for (const dependency of entryModule.dependencies) {
                const mod =
                  compilation.moduleGraph.getResolvedModule(dependency)
                if (mod?.buildInfo?.nextraSearch) {
                  entryModule = mod
                }
              }
            }
            const nextraSearch = entryModule?.buildInfo?.nextraSearch
            if (nextraSearch) {
              const { title, data, indexKey, route } = nextraSearch
              const indexFilename = `nextra-data-${indexKey}.json`
              indexFiles[indexFilename] ??= {}
              indexFiles[indexFilename][route] = { title, data }
            }
          }
          for (const [file, content] of Object.entries(indexFiles)) {
            assets[`${IS_PRODUCTION ? '../' : ''}../static/chunks/${file}`] =
              new sources.RawSource(JSON.stringify(content))
          }
        }
      )
    })
  }
}
