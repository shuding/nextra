import fs from 'node:fs/promises'
import path from 'node:path'
import prettier from 'prettier'
import { generatePageMapFromFilepaths } from '../src/server/generate-page-map.js'

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
  vi.doMock('next/dist/lib/find-pages-dir.js', () => ({
    findPagesDir: () => ({ appDir: dir })
  }))
  vi.doMock('../src/server/constants.ts', async () => ({
    ...(await vi.importActual('../src/server/constants.ts')),
    CHUNKS_DIR: dir
  }))
  const { getFilepaths, collectPageMap } = await import(
    '../src/server/page-map.js'
  )

  const relativePaths = await getFilepaths({ dir })

  const { pageMap: _pageMap, mdxPages } =
    generatePageMapFromFilepaths(relativePaths)
  const rawJs = await collectPageMap({
    pageMap: _pageMap,
    mdxPages,
    fromAppDir: false
  })

  await fs.writeFile(
    path.join(dir, 'generated-page-map.ts'),
    '// @ts-nocheck\n' +
      rawJs.replaceAll('private-next-root-dir/content/', './')
  )

  const { pageMap } = await import(`${dir}/generated-page-map.js`)
  return pageMap
}
