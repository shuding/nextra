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
