import fs from 'node:fs/promises'
import path from 'node:path'
import { normalizePages } from '../src/client/normalize-pages.js'
import { usPageMap } from './fixture/page-maps/page-map.js'

describe('normalize-page', () => {
  it('en-US home', () => {
    const result = normalizePages({
      list: usPageMap,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US getting-started', () => {
    const result = normalizePages({
      list: usPageMap,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('/404 page', () => {
    const result = normalizePages({
      list: [
        { name: '404', route: '/404' },
        { name: 'get-started', route: '/get-started' },
        { name: 'index', route: '/' },
        {
          data: {
            '404': {
              type: 'page',
              theme: {
                layout: 'full'
              }
            },
            index: {
              title: 'Introduction'
            },
            'get-started': {
              title: 'Get Started'
            }
          }
        }
      ],
      route: '/500ddd'
    })
    expect(result).toMatchSnapshot()
  })

  // https://github.com/shuding/nextra/issues/3331
  it('should keep `activeThemeContext`, `activeType` for hidden route', async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'hidden-route-should-have-theme-context'
    )
    vi.doMock('../src/server/file-system.ts', () => ({ PAGES_DIR: dir }))
    vi.doMock('../src/server/constants.ts', async () => ({
      ...(await vi.importActual('../src/server/constants.ts')),
      CHUNKS_DIR: dir
    }))
    const { collectPageMap } = await import('../src/server/page-map.js')

    const result = await collectPageMap({ dir })
    await fs.writeFile(path.join(dir, 'generated-page-map.ts'), result)

    const { pageMap } = await import(
      './fixture/page-maps/hidden-route-should-have-theme-context/generated-page-map.js'
    )

    expect(pageMap).toEqual([
      {
        data: {
          '*': {
            display: 'hidden',
            theme: {
              typesetting: 'article'
            }
          }
        }
      },
      {
        name: '1-level',
        route: '/1-level',
        children: [
          {
            name: '2-level',
            route: '/1-level/2-level',
            children: [
              {
                data: {
                  foo: {
                    type: 'page',
                    theme: {
                      layout: 'full',
                      sidebar: false,
                      toc: false
                    }
                  }
                }
              },
              {
                name: 'foo',
                route: '/1-level/2-level/foo',
                frontMatter: {
                  sidebarTitle: 'Foo'
                }
              }
            ]
          },
          {
            name: 'qux',
            route: '/1-level/qux',
            frontMatter: {
              sidebarTitle: 'Qux'
            }
          }
        ]
      },
      {
        name: 'bar',
        route: '/bar',
        frontMatter: {
          sidebarTitle: 'Bar'
        }
      }
    ])

    const result2 = normalizePages({
      list: pageMap,
      route: '/1-level/2-level/foo'
    })
    expect(result2).toMatchSnapshot()
  })

  it('should initialize `activeType` from `*`', async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'active-type-should-be-initialized-from-star'
    )
    vi.doMock('../src/server/file-system.ts', () => ({ PAGES_DIR: dir }))
    vi.doMock('../src/server/constants.ts', async () => ({
      ...(await vi.importActual('../src/server/constants.ts')),
      CHUNKS_DIR: dir
    }))
    const { collectPageMap } = await import('../src/server/page-map.js')

    const result = await collectPageMap({ dir })
    await fs.writeFile(path.join(dir, 'generated-page-map.ts'), result)

    const { pageMap } = await import(
      './fixture/page-maps/active-type-should-be-initialized-from-star/generated-page-map.js'
    )

    expect(pageMap).toEqual([
      {
        data: {
          '1-level': {
            display: 'hidden',
            theme: {
              layout: 'full'
            }
          }
        }
      },
      {
        name: '1-level',
        route: '/1-level',
        children: [
          {
            data: {
              '*': {
                type: 'page',
                theme: {
                  layout: 'default',
                  toc: false
                }
              }
            }
          },
          {
            name: 'foo',
            route: '/1-level/foo',
            frontMatter: {
              sidebarTitle: 'Foo'
            }
          }
        ]
      }
    ])

    const { activeType, activeIndex, activeThemeContext } = normalizePages({
      list: pageMap,
      route: '/1-level/not-exist'
    })
    expect({ activeType, activeIndex, activeThemeContext }).toEqual({
      activeType: 'page',
      activeIndex: 0,
      activeThemeContext: {
        breadcrumb: true,
        collapsed: false,
        footer: true,
        layout: 'default',
        navbar: true,
        pagination: true,
        sidebar: true,
        timestamp: true,
        toc: false,
        typesetting: 'default'
      }
    })
  })

  it('should respect order for `type: "separator"`, `type: "menu"` and item with `href`', async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'respect-order-for-type-separator-menu-and-item-with-href'
    )
    vi.doMock('../src/server/file-system.ts', () => ({ PAGES_DIR: dir }))
    vi.doMock('../src/server/constants.ts', async () => ({
      ...(await vi.importActual('../src/server/constants.ts')),
      CHUNKS_DIR: dir
    }))
    const { collectPageMap } = await import('../src/server/page-map.js')

    const result = await collectPageMap({ dir })
    await fs.writeFile(path.join(dir, 'generated-page-map.ts'), result)

    const { pageMap } = await import(
      './fixture/page-maps/respect-order-for-type-separator-menu-and-item-with-href/generated-page-map.js'
    )

    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/one/two/qux'
    })
    expect(normalizedResult.docsDirectories).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "items": {
                    "nextra": {
                      "href": "https://nextra.site",
                      "title": "Nextra",
                    },
                  },
                  "name": "menu",
                  "title": "menu",
                  "type": "menu",
                },
                {
                  "isUnderCurrentDocsTree": true,
                  "name": "---",
                  "type": "separator",
                },
                {
                  "frontMatter": {
                    "sidebarTitle": "Qux",
                  },
                  "isUnderCurrentDocsTree": true,
                  "name": "qux",
                  "route": "/one/two/qux",
                  "title": "Qux",
                  "type": "doc",
                },
                {
                  "href": "https://nextra.site",
                  "isUnderCurrentDocsTree": true,
                  "name": "nextra",
                  "title": "Nextra",
                  "type": "doc",
                },
                {
                  "frontMatter": {
                    "sidebarTitle": "1 One",
                  },
                  "isUnderCurrentDocsTree": true,
                  "name": "1-one",
                  "route": "/one/two/1-one",
                  "title": "1 One",
                  "type": "doc",
                },
                {
                  "frontMatter": {
                    "sidebarTitle": "2024",
                  },
                  "isUnderCurrentDocsTree": true,
                  "name": "2024",
                  "route": "/one/two/2024",
                  "title": "2024",
                  "type": "doc",
                },
                {
                  "frontMatter": {
                    "sidebarTitle": "Foo",
                  },
                  "isUnderCurrentDocsTree": true,
                  "name": "foo",
                  "route": "/one/two/foo",
                  "title": "Foo",
                  "type": "doc",
                },
                {
                  "frontMatter": {
                    "sidebarTitle": "One",
                  },
                  "isUnderCurrentDocsTree": true,
                  "name": "one",
                  "route": "/one/two/one",
                  "title": "One",
                  "type": "doc",
                },
              ],
              "isUnderCurrentDocsTree": true,
              "name": "two",
              "route": "/one/two",
              "title": "two",
              "type": "doc",
            },
          ],
          "isUnderCurrentDocsTree": true,
          "name": "one",
          "route": "/one",
          "title": "one",
          "type": "doc",
        },
      ]
    `)
  })

  it('`type: "menu"` should contain `items`', async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'type-menu-should-contain-items'
    )
    vi.doMock('../src/server/file-system.ts', () => ({ PAGES_DIR: dir }))
    vi.doMock('../src/server/constants.ts', async () => ({
      ...(await vi.importActual('../src/server/constants.ts')),
      CHUNKS_DIR: dir
    }))
    const { collectPageMap } = await import('../src/server/page-map.js')

    const result = await collectPageMap({ dir })
    await fs.writeFile(path.join(dir, 'generated-page-map.ts'), result)

    const { pageMap } = await import(
      './fixture/page-maps/type-menu-should-contain-items/generated-page-map.js'
    )

    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/pagesOnly/one'
    })
    expect(
      normalizedResult.topLevelNavbarItems.find(i => i.name === 'mix')
    ).toHaveProperty('items')
    expect(
      normalizedResult.topLevelNavbarItems.find(i => i.name === 'pagesOnly')
    ).toHaveProperty('items')
    expect(normalizedResult.topLevelNavbarItems).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "frontMatter": {
                "sidebarTitle": "Not Specified",
              },
              "name": "not-specified",
              "route": "/mix/not-specified",
              "title": "Not Specified",
              "type": "doc",
            },
            {
              "frontMatter": {
                "sidebarTitle": "Qux",
              },
              "name": "qux",
              "route": "/mix/qux",
              "title": "Qux",
              "type": "doc",
            },
          ],
          "firstChildRoute": "/mix/not-specified",
          "items": {
            "nextra": {
              "href": "https://nextra.site",
              "title": "Nextra",
            },
            "qux": {
              "title": "Qux",
            },
          },
          "name": "mix",
          "route": "/mix",
          "title": "Mix",
          "type": "menu",
        },
        {
          "items": {
            "nextra": {
              "href": "https://nextra.site",
              "title": "Nextra",
            },
          },
          "name": "hrefOnly",
          "title": "Href Only",
          "type": "menu",
        },
        {
          "children": [
            {
              "frontMatter": {
                "sidebarTitle": "One",
              },
              "name": "one",
              "route": "/pagesOnly/one",
              "title": "One",
              "type": "doc",
            },
            {
              "frontMatter": {
                "sidebarTitle": "Two",
              },
              "name": "two",
              "route": "/pagesOnly/two",
              "title": "Two",
              "type": "doc",
            },
          ],
          "firstChildRoute": "/pagesOnly/one",
          "items": {
            "one": {
              "title": "One",
            },
            "two": {
              "title": "Two",
            },
          },
          "name": "pagesOnly",
          "route": "/pagesOnly",
          "title": "Pages Only",
          "type": "menu",
        },
      ]
    `)
  })

  it('pages order without `type: "page"`', async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'pages-order-without-type-page'
    )
    vi.doMock('../src/server/file-system.ts', () => ({ PAGES_DIR: dir }))
    vi.doMock('../src/server/constants.ts', async () => ({
      ...(await vi.importActual('../src/server/constants.ts')),
      CHUNKS_DIR: dir
    }))
    const { collectPageMap } = await import('../src/server/page-map.js')

    const result = await collectPageMap({ dir })
    await fs.writeFile(path.join(dir, 'generated-page-map.ts'), result)

    const { pageMap } = await import(
      './fixture/page-maps/pages-order-without-type-page/generated-page-map.js'
    )

    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/docs/bar'
    })
    const { flatDirectories } = normalizedResult
    expect(flatDirectories[0].name).toBe('_')
    expect(flatDirectories[1].route).toBe('/docs/bar')
    expect(flatDirectories[2].route).toBe('/foo')
  })

  // https://github.com/shuding/nextra/issues/3581
  it("folder's index page and folder itself should be merged", async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'folder-index-page-and-folder-should-be-merged'
    )
    vi.doMock('../src/server/file-system.ts', () => ({ PAGES_DIR: dir }))
    vi.doMock('../src/server/constants.ts', async () => ({
      ...(await vi.importActual('../src/server/constants.ts')),
      CHUNKS_DIR: dir
    }))
    const { collectPageMap } = await import('../src/server/page-map.js')

    const result = await collectPageMap({ dir })
    await fs.writeFile(path.join(dir, 'generated-page-map.ts'), result)

    const { pageMap } = await import(
      './fixture/page-maps/folder-index-page-and-folder-should-be-merged/generated-page-map.js'
    )

    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/themes'
    })
    expect(normalizedResult.docsDirectories).toEqual([
      {
        name: 'themes',
        route: '/themes',
        children: [
          {
            name: 'bar',
            route: '/themes/bar',
            frontMatter: { sidebarTitle: 'Bar' },
            type: 'doc',
            title: 'Bar',
            isUnderCurrentDocsTree: true
          }
        ],
        withIndexPage: true,
        frontMatter: { sidebarTitle: 'Themes' },
        type: 'doc',
        title: 'Themes',
        isUnderCurrentDocsTree: true
      },
      {
        name: 'themes-test',
        route: '/themes-test',
        children: [
          {
            name: 'foo',
            route: '/themes-test/foo',
            frontMatter: { sidebarTitle: 'Foo' },
            type: 'doc',
            title: 'Foo',
            isUnderCurrentDocsTree: true
          }
        ],
        withIndexPage: true,
        frontMatter: { sidebarTitle: 'Themes Test' },
        type: 'doc',
        title: 'Themes Test',
        isUnderCurrentDocsTree: true
      }
    ])
  })
})
