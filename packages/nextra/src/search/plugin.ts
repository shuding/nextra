import { sources, webpack } from 'next/dist/compiled/webpack/webpack'
import type { Compiler } from 'webpack'

const PLUGIN_NAME = 'NextraSearchPlugin'
const isDev = process.env.NODE_ENV !== 'production'
export class NextraSearchPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.make.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        assets => {
          const indexFiles: Record<string, string> = {}

          for (const [, entry] of compilation.entries.entries()) {
            const entryDependency = entry.dependencies?.[0]

            // There're some Next.js refactors that might cause the MDX module
            // to be a dependency of the entry module, instead of the entry
            // itself. This is a workaround to find the MDX module loaded by
            // Nextra.
            let entryModule =
              compilation.moduleGraph.getResolvedModule(entryDependency)
            if (!entryModule?.buildInfo?.nextraSearch) {
              for (const dependency of entryModule.dependencies) {
                const mod =
                  compilation.moduleGraph.getResolvedModule(dependency)
                if (mod?.buildInfo?.nextraSearch) {
                  entryModule = mod
                }
              }
            }

            if (entryModule?.buildInfo?.nextraSearch) {
              const { title, data, indexKey, route } =
                entryModule.buildInfo.nextraSearch

              const indexFilename = `nextra-data-${indexKey}.json`
              if (indexFiles[indexFilename] === undefined) {
                indexFiles[indexFilename] = '{'
              }
              if (indexFiles[indexFilename] !== '{') {
                indexFiles[indexFilename] += ','
              }
              indexFiles[indexFilename] += `${JSON.stringify(
                route
              )}:{"title":${JSON.stringify(title)},"data":${JSON.stringify(
                data
              )}}`
            }
          }

          for (const [file, content] of Object.entries(indexFiles)) {
            assets[
              (isDev ? '../static/chunks/' : '../../static/chunks/') + file
            ] = new sources.RawSource(content + '}')
          }
        }
      )
    })
  }
}
