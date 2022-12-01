import { describe, it, expect, beforeAll } from 'vitest'
import path from 'node:path'
import { getPageMap } from '../src/page-map'
import { collectFiles } from '../src/plugin'
import { FileMap, PageMapItem } from '../src/types'
import { CWD } from '../src/constants'

const PAGES_DIR = path.join(CWD, '..', '..', 'examples', 'swr-site', 'pages')
const filePath = (name: string) => path.join(PAGES_DIR, name)

const defaultLocale = 'en-US'

describe('Page Process', () => {
  let pageMap: PageMapItem[]
  let fileMap: FileMap
  beforeAll(async () => {
    const { items, fileMap: data } = await collectFiles(PAGES_DIR)
    pageMap = items
    fileMap = data
  })

  it('pageMap en-US', async () => {
    const indexData = await getPageMap({
      filePath: filePath('docs/data-fetching.en-US.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    })
    expect([
      indexData.pageMap,
      indexData.route,
      indexData.title
    ]).toMatchSnapshot()

    const gettingStartData = await getPageMap({
      filePath: filePath('docs/getting-started.en-US.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    })
    expect(gettingStartData.pageMap).toEqual(indexData.pageMap)
  })

  it('pageMap zh-CN', async () => {
    const indexData = await getPageMap({
      filePath: filePath('docs/data-fetching.zh-CN.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    })
    expect([
      indexData.pageMap,
      indexData.route,
      indexData.title
    ]).toMatchSnapshot()

    const gettingStartData = await getPageMap({
      filePath: filePath('docs/getting-started.zh-CN.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    })
    expect(gettingStartData.pageMap).toEqual(indexData.pageMap)
  })
})
