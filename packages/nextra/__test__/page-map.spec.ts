import { describe, it, expect, beforeAll } from 'vitest'
import path from 'path'
import { getPageMap } from '../src/page-map'
import { collectFiles } from '../src/plugin'
const pagesDir = () => '../../examples/swr-site/pages'
const filePath = (name: string) => path.join(process.cwd(), pagesDir(), name)
const defaultLocale = 'en-US'

describe('Page Process', () => {
  let pageMap: any = {}
  let fileMap: any = {}
  beforeAll(async () => {
    const { items, fileMap: data } = await collectFiles(
      path.join(process.cwd(), pagesDir()),
      '/'
    )
    pageMap = items
    fileMap = data
  })
  it('pageMap en-US', async () => {
    const indexData = await getPageMap(
      filePath('docs/data-fetching.en-US.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    )
    expect(indexData).toMatchSnapshot()

    const gettingStartData = await getPageMap(
      filePath('docs/getting-started.en-US.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    )
    expect(gettingStartData[0]).toEqual(indexData[0])
  })

  it('pageMap zh-CN', async () => {
    const indexData = await getPageMap(
      filePath('docs/data-fetching.zh-CN.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    )
    expect(indexData).toMatchSnapshot()

    const gettingStartData = await getPageMap(
      filePath('docs/getting-started.zh-CN.mdx'),
      pageMap,
      fileMap,
      defaultLocale
    )
    expect(gettingStartData[0]).toEqual(indexData[0])
  })
})
