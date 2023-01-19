import type { Compiler } from 'webpack'
import { webpack, sources } from 'next/dist/compiled/webpack/webpack'

const PLUGIN_NAME = 'NextraSearchPlugin'

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
            const entryModule =
              compilation.moduleGraph.getResolvedModule(entryDependency)

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
            assets['../static/chunks/' + file] = new sources.RawSource(
              content + '}'
            )
          }
        }
      )
    })
  }
}
