import path from 'node:path'
import { CWD } from '../src/constants'
import { collectFiles } from '../src/plugin'

describe('Page Process', () => {
  it("should not add `_meta.json` file if folder doesn't contain markdown files", async () => {
    const { items } = await collectFiles({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-markdown-files'
      )
    })
    expect(items).toEqual([])
  })

  it("should add `_meta.json` file if it's missing", async () => {
    const { items } = await collectFiles({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-meta-json'
      )
    })
    expect(items).toEqual([
      { name: 'callout', route: '/callout' },
      { name: 'tabs', route: '/tabs' },
      { data: { callout: 'Callout', tabs: 'Tabs' } }
    ])
  })

  it('should resolve symlinked files and directories', async () => {
    const { items } = await collectFiles({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-with-symlinks',
        'pages'
      )
    })
    expect(items).toEqual([
      {
        name: 'docs',
        route: '/docs',
        children: [
          { name: 'test2', route: '/docs/test2' },
          { data: { test2: 'Test2' } }
        ]
      },
      { name: 'test1', route: '/test1' },
      { data: { test1: 'Test1' } }
    ])
  })

  it('should match i18n site page maps', async () => {
    const chunksPath = path.join(
      CWD,
      '..',
      '..',
      'examples',
      'swr-site',
      '.next',
      'static',
      'chunks'
    )
    const { pageMap: enPageMap } = await import(
      chunksPath + '/nextra-page-map-en.mjs'
    )
    const { pageMap: esPageMap } = await import(
      chunksPath + '/nextra-page-map-es.mjs'
    )
    const { pageMap: ruPageMap } = await import(
      chunksPath + '/nextra-page-map-ru.mjs'
    )
    expect({ enPageMap, esPageMap, ruPageMap }).toMatchSnapshot()
  })
})
