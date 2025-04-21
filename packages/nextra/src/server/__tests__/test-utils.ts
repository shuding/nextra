import fs from 'node:fs/promises'
import path from 'node:path'
import prettier from 'prettier'
import { findMetaAndPageFilePaths } from '../page-map/find-meta-and-page-file-paths.js'
import { convertPageMapToJs } from '../page-map/to-js.js'
import { convertToPageMap } from '../page-map/to-page-map.js'

export type IsEqual<A, B> =
  (<G>() => G extends (A & G) | G ? 1 : 2) extends <G>() => G extends
    | (B & G)
    | G
    ? 1
    : 2
    ? true
    : false

export async function clean(content: string): Promise<string> {
  const result = await prettier.format(content, {
    parser: 'typescript',
    semi: false,
    trailingComma: 'none',
    singleQuote: true,
    printWidth: 120,
    arrowParens: 'avoid'
  })
  return result.trimEnd()
}

export async function getPageMapForFixture(dirName: string) {
  const dir = path.join(import.meta.dirname, 'fixture', 'page-maps', dirName)
  const filePaths = await findMetaAndPageFilePaths({ dir, cwd: dir })
  const { pageMap, mdxPages } = convertToPageMap({ filePaths })
  const rawJs = convertPageMapToJs({ pageMap, mdxPages })

  await fs.writeFile(
    path.join(dir, 'generated-page-map.ts'),
    '// @ts-nocheck\n' + rawJs.replaceAll('private-next-root-dir', '.')
  )

  const result = await import(`${dir}/generated-page-map.js`)
  return result.pageMap
}
