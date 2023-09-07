import path from 'node:path'
import { CWD } from '../src/constants'
import { getDynamicMeta } from '../src/page-map'
import { collectFiles } from '../src/plugin'
import type { PageMapItem } from '../src/types'

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

  describe('getDynamicMeta()', () => {
    const items: PageMapItem[] = [
      {
        name: 'remote',
        route: '/remote',
        children: [
          {
            __nextra_src:
              '/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/_meta.js',
            data: {}
          },
          {
            name: 'graphql-eslint',
            route: '/remote/graphql-eslint',
            children: [
              {
                __nextra_src:
                  '/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/graphql-eslint/_meta.js',
                data: {}
              }
            ]
          },
          {
            name: 'graphql-yoga',
            route: '/remote/graphql-yoga',
            children: [
              {
                __nextra_src:
                  '/Users/dmytro/Desktop/nextra/examples/swr-site/pages/remote/graphql-yoga/_meta.js',
                data: {}
              }
            ]
          }
        ]
      }
    ]
    it('should return dynamicItems for unset locale', () => {
      const result = getDynamicMeta('', items)
      expect(result).toMatchInlineSnapshot(`
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
                },
                {
                  "children": [
                    {
                      "data": {},
                    },
                  ],
                  "name": "graphql-eslint",
                  "route": "/remote/graphql-eslint",
                },
                {
                  "children": [
                    {
                      "data": {},
                    },
                  ],
                  "name": "graphql-yoga",
                  "route": "/remote/graphql-yoga",
                },
              ],
              "name": "remote",
              "route": "/remote",
            },
          ],
        ]
      `)
    })
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
