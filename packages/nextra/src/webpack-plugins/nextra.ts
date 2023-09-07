import { join } from 'node:path'
import pkg from 'graceful-fs'
import type { Compiler } from 'webpack'
import { CHUNKS_DIR } from '../constants'
import { PAGES_DIR } from '../file-system'
import { toPageMap } from '../to-page-map'

const fs = pkg.promises

export class NextraPlugin {
  constructor(private config: { locales: string[] }) {}

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name
    const { locales } = this.config

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (_, callback) => {
      try {
        const fileMaps = Object.create(null)
        for (const locale of locales) {
          const { rawJs, fileMap } = await toPageMap({
            dir: PAGES_DIR + locale
          })
          Object.assign(fileMaps, fileMap)
          // const folderItem =
          //   locale === ''
          //     ? { children: result.items }
          //     : result.items.find(
          //         (item): item is Folder =>
          //           'name' in item && item.name === locale
          //       )

          // if (!folderItem) continue

          await fs.mkdir(join(CHUNKS_DIR), { recursive: true })

          // const [dynamicMetaItems, filteredItems] = getDynamicMeta(
          //   '',
          //   folderItem.children
          // )

          const dynamicMetaImports: string[] = []
          const dynamicMetaFunctions: string[] = []

          // for (const [
          //   index,
          //   { metaFilePath, ...descriptor }
          // ] of dynamicMetaItems.entries()) {
          //   dynamicMetaImports.push(
          //     `import dynamicMeta${index} from '${metaFilePath}'`
          //   )
          //   dynamicMetaFunctions.push(
          //     `[dynamicMeta${index}, ${JSON.stringify(descriptor)}]`
          //   )
          // }

          await fs.writeFile(
            join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`),
            `${dynamicMetaImports.join('\n')}
${rawJs}

export const dynamicMetaModules = [${dynamicMetaFunctions.join(',')}]`
          )
        }

        await fs.writeFile(
          join(CHUNKS_DIR, 'nextra-file-map.mjs'),
          `export const fileMap = ${JSON.stringify(fileMaps)}`
        )
        callback()
      } catch (error) {
        callback(error as Error)
      }
    })
  }
}
