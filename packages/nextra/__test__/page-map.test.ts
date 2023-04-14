import { describe, it, expect, beforeAll } from 'vitest'
import path from 'node:path'
import { getDynamicMeta, resolvePageMap } from '../src/page-map'
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
    const { items, fileMap: data } = await collectFiles({
      dir: PAGES_DIR,
      locales: nextConfig.default.i18n.locales
    })
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

  it('should add `_meta.json` file if it missing', async () => {
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
      { kind: 'MdxPage', name: 'callout', route: '/callout' },
      { kind: 'MdxPage', name: 'tabs', route: '/tabs' },
      { kind: 'Meta', data: { callout: 'Callout', tabs: 'Tabs' } }
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
        kind: 'Folder',
        name: 'docs',
        route: '/docs',
        children: [
          { kind: 'MdxPage', name: 'test2', route: '/docs/test2' },
          { kind: 'Meta', data: { test2: 'Test2' } }
        ]
      },
      { kind: 'MdxPage', name: 'test1', route: '/test1' },
      { kind: 'Meta', data: { test1: 'Test1' } }
    ])
  })

  describe('getDynamicMeta()', () => {
    const items: PageMapItem[] = [
      {
        kind: 'Folder',
        name: 'remote',
        route: '/remote',
        children: [
          {
            kind: 'Meta',
            __nextra_src:
              '/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/_meta.js',
            data: {}
          },
          {
            kind: 'Folder',
            name: 'graphql-eslint',
            route: '/remote/graphql-eslint',
            children: [
              {
                kind: 'Meta',
                __nextra_src:
                  '/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/graphql-eslint/_meta.js',
                data: {}
              }
            ]
          },
          {
            kind: 'Folder',
            name: 'graphql-yoga',
            route: '/remote/graphql-yoga',
            children: [
              {
                kind: 'Meta',
                __nextra_src:
                  '/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/graphql-yoga/_meta.js',
                data: {}
              }
            ]
          }
        ]
      }
    ]
    it('should not return dynamicItems for incorrect locale', () => {
      expect(getDynamicMeta('', items, 'en-US')).toMatchInlineSnapshot(`
        [
          [],
          [],
        ]
      `)
    })
    it('should return dynamicItems for unset locale', () => {
      expect(getDynamicMeta('', items)).toMatchInlineSnapshot(`
        [
          [
            {
              "metaFilePath": "/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/_meta.js",
              "metaObjectKeyPath": "[0].children[0]",
              "metaParentKeyPath": "[0]",
            },
            {
              "metaFilePath": "/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/graphql-eslint/_meta.js",
              "metaObjectKeyPath": "[0].children[1].children[0]",
              "metaParentKeyPath": "[0].children[1]",
            },
            {
              "metaFilePath": "/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/graphql-yoga/_meta.js",
              "metaObjectKeyPath": "[0].children[2].children[0]",
              "metaParentKeyPath": "[0].children[2]",
            },
          ],
          [
            {
              "children": [
                {
                  "data": {},
                  "kind": "Meta",
                },
                {
                  "children": [
                    {
                      "data": {},
                      "kind": "Meta",
                    },
                  ],
                  "kind": "Folder",
                  "name": "graphql-eslint",
                  "route": "/remote/graphql-eslint",
                },
                {
                  "children": [
                    {
                      "data": {},
                      "kind": "Meta",
                    },
                  ],
                  "kind": "Folder",
                  "name": "graphql-yoga",
                  "route": "/remote/graphql-yoga",
                },
              ],
              "kind": "Folder",
              "name": "remote",
              "route": "/remote",
            },
          ],
        ]
      `)
    })
  })
})
