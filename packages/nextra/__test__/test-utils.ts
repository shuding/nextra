import fs from 'node:fs/promises'
import path from 'node:path'
import prettier from 'prettier'
import {
  generatePageMap,
  getFilepaths
} from '../src/server/page-map/generate.js'
import { transformPageMapToJs } from '../src/server/page-map/to-js.js'

export function clean(content: string): Promise<string> {
  return prettier.format(content, {
    parser: 'typescript',
    semi: false,
    trailingComma: 'none',
    singleQuote: true,
    printWidth: 120,
    arrowParens: 'avoid'
  })
}

export async function getPageMapForFixture(dirName: string) {
  const dir = path.join(__dirname, 'fixture', 'page-maps', dirName)

  const filePaths = await getFilepaths({ dir, cwd: dir })
  const { pageMap, mdxPages } = generatePageMap({ filePaths })
  const rawJs = await transformPageMapToJs({ pageMap, mdxPages })

  await fs.writeFile(
    path.join(dir, 'generated-page-map.ts'),
    '// @ts-nocheck\n' + rawJs.replaceAll('private-next-root-dir/', './')
  )

  const result = await import(`${dir}/generated-page-map.js`)
  return result.pageMap
}
