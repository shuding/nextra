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
    const nextConfig = await import(
      path.join(CWD, '..', '..', 'examples', 'swr-site', 'next.config.mjs')
    )
    const { items, fileMap: data } = await collectFiles(
      PAGES_DIR,
      nextConfig.default.i18n.locales
    )
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

  it("should not add `_meta.json` file if folder doesn't contain markdown files", async () => {
    const { items } = await collectFiles(
      path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-markdown-files'
      )
    )
    expect(items).toEqual([])
  })

  it('should add `_meta.json` file if it missing', async () => {
    const { items } = await collectFiles(
      path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-meta-json'
      )
    )
    expect(items).toEqual([
      { kind: 'MdxPage', name: 'callout', route: '/callout' },
      { kind: 'MdxPage', name: 'tabs', route: '/tabs' },
      { kind: 'Meta', data: { callout: 'Callout', tabs: 'Tabs' } }
    ])
  })
})
