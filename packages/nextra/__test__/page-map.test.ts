import { describe, it, expect, beforeAll } from 'vitest'
import path from 'node:path'
import { resolvePageMap } from '../src/page-map'
import { collectFiles } from '../src/plugin'
import type { FileMap, PageMapItem } from '../src/types'
import { CWD } from '../src/constants'

const PAGES_DIR = path.join(CWD, '..', '..', 'examples', 'swr-site', 'pages')
const filePath = (name: string) => path.join(PAGES_DIR, name)

const defaultLocale = 'en-US'

describe('Page Process', () => {
  let pageMap: PageMapItem[]
  let fileMap: FileMap
  beforeAll(async () => {
    const { items, fileMap: data } = await collectFiles(PAGES_DIR, [''])
    pageMap = items
    fileMap = data
  })

  it('pageMap en-US', () => {
    const indexData = resolvePageMap({
      filePath: filePath('docs/data-fetching.en-US.mdx'),
      items: pageMap,
      fileMap,
      defaultLocale
    })
    expect([indexData.pageMap, indexData.route]).toMatchSnapshot()

    const gettingStartData = resolvePageMap({
      filePath: filePath('docs/getting-started.en-US.mdx'),
      items: pageMap,
      fileMap,
      defaultLocale
    })
    expect(gettingStartData.pageMap).toEqual(indexData.pageMap)
  })

  it('pageMap ru', () => {
    const indexData = resolvePageMap({
      filePath: filePath('docs/data-fetching.ru.mdx'),
      items: pageMap,
      fileMap,
      defaultLocale
    })
    expect([indexData.pageMap, indexData.route]).toMatchSnapshot()

    const gettingStartData = resolvePageMap({
      filePath: filePath('docs/getting-started.ru.mdx'),
      items: pageMap,
      fileMap,
      defaultLocale
    })
    expect(gettingStartData.pageMap).toEqual(indexData.pageMap)
  })

  it("should not add to pageMap folders that doesn't contain markdown files", async () => {
    const { items } = await collectFiles(
      path.join(PAGES_DIR, 'docs/test-non-md-folders'),
      ['']
    )
    expect(items.length).toBe(0)
  })
})
