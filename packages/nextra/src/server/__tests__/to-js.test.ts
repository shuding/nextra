import path from 'node:path'
import { CWD } from '../constants.js'
import { findMetaAndPageFilePaths } from '../page-map/find-meta-and-page-file-paths.js'
import { convertToPageMap } from '../page-map/to-page-map.js'
import { convertPageMapToJs } from '../page-map/to-js.js'

describe('convertPageMapToJs()', () => {
  it('should work for docs example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'docs')
    const filePaths = await findMetaAndPageFilePaths({
      dir: path.join(cwd, 'src/app'),
      cwd,
      contentDir: 'src/content'
    })
    const { pageMap, mdxPages } = convertToPageMap({ filePaths })

    const result = convertPageMapToJs({ pageMap, mdxPages })
    expect(result).toMatchInlineSnapshot()
  })
})
