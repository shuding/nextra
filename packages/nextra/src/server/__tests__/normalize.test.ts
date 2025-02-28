import { normalizePages } from '../../client/normalize-pages.js'
import { normalizePageMap } from '../page-map/normalize.js'
import { usPageMap } from './fixture/page-maps/page-map.js'
import { getPageMapForFixture } from './test-utils.js'

describe('normalize-page', () => {
  it('en-US home', () => {
    const result = normalizePages({
      list: normalizePageMap(usPageMap),
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US getting-started', () => {
    const result = normalizePages({
      list: normalizePageMap(usPageMap),
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  // https://github.com/shuding/nextra/issues/3331
  it('should keep `activeThemeContext`, `activeType` for hidden route', async () => {
    const pageMap = await getPageMapForFixture(
      'hidden-route-should-have-theme-context'
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
        title: '1 Level',
        children: [
          {
            name: '2-level',
            route: '/1-level/2-level',
            title: '2 Level',
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
                frontMatter: undefined,
                title: 'Foo'
              }
            ]
          },
          {
            name: 'qux',
            route: '/1-level/qux',
            frontMatter: undefined,
            title: 'Qux'
          }
        ]
      },
      {
        name: 'bar',
        route: '/bar',
        frontMatter: undefined,
        title: 'Bar'
      }
    ])

    const result2 = normalizePages({
      list: normalizePageMap(pageMap),
      route: '/1-level/2-level/foo'
    })
    expect(result2).toMatchSnapshot()
  })

  it('should initialize `activeType` from `*`', async () => {
    const pageMap = await getPageMapForFixture(
      'active-type-should-be-initialized-from-star'
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
        title: '1 Level',
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
            frontMatter: undefined,
            title: 'Foo'
          }
        ]
      }
    ])

    const { activeType, activeIndex, activeThemeContext } = normalizePages({
      list: normalizePageMap(pageMap),
      route: '/1-level/not-exist'
    })
    expect({ activeType, activeIndex, activeThemeContext }).toEqual({
      activeType: 'page',
      activeIndex: 0,
      activeThemeContext: {
        breadcrumb: true,
        collapsed: undefined,
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
    const pageMap = await getPageMapForFixture(
      'respect-order-for-type-separator-menu-and-item-with-href'
    )

    const normalizedResult = normalizePages({
      list: normalizePageMap(pageMap),
      route: '/one/two/qux'
    })
    expect(normalizedResult.docsDirectories).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "isUnderCurrentDocsTree": true,
                  "name": "---",
                  "type": "separator",
                },
                {
                  "frontMatter": undefined,
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
                  "frontMatter": undefined,
                  "isUnderCurrentDocsTree": true,
                  "name": "1-one",
                  "route": "/one/two/1-one",
                  "title": "1 One",
                  "type": "doc",
                },
                {
                  "frontMatter": undefined,
                  "isUnderCurrentDocsTree": true,
                  "name": "2024",
                  "route": "/one/two/2024",
                  "title": "2024",
                  "type": "doc",
                },
                {
                  "frontMatter": undefined,
                  "isUnderCurrentDocsTree": true,
                  "name": "foo",
                  "route": "/one/two/foo",
                  "title": "Foo",
                  "type": "doc",
                },
                {
                  "frontMatter": undefined,
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
              "title": "Two",
              "type": "doc",
            },
          ],
          "isUnderCurrentDocsTree": true,
          "name": "one",
          "route": "/one",
          "title": "One",
          "type": "doc",
        },
      ]
    `)
  })

  it('`type: "menu"` should contain `items`', async () => {
    const pageMap = await getPageMapForFixture('type-menu-should-contain-items')

    const normalizedResult = normalizePages({
      list: normalizePageMap(pageMap),
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
              "frontMatter": undefined,
              "name": "not-specified",
              "route": "/mix/not-specified",
              "title": "Not Specified",
              "type": "doc",
            },
            {
              "frontMatter": undefined,
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
              "frontMatter": undefined,
              "name": "one",
              "route": "/pagesOnly/one",
              "title": "One",
              "type": "doc",
            },
            {
              "frontMatter": undefined,
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
    const pageMap = await getPageMapForFixture('pages-order-without-type-page')

    const normalizedResult = normalizePages({
      list: normalizePageMap(pageMap),
      route: '/docs/bar'
    })
    const { docsDirectories } = normalizedResult
    expect(docsDirectories[0]!.name).toBe('_')
    expect(docsDirectories[1]!.route).toBe('/docs/bar')
    expect(docsDirectories[2]!.route).toBe('/foo')
  })

  // https://github.com/shuding/nextra/issues/3581
  it("folder's index page and folder itself should be merged", async () => {
    const pageMap = await getPageMapForFixture(
      'folder-index-page-and-folder-should-be-merged'
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
            frontMatter: undefined,
            type: 'doc',
            title: 'Bar',
            isUnderCurrentDocsTree: true
          }
        ],
        frontMatter: {
          asIndexPage: true
        },
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
            frontMatter: undefined,
            type: 'doc',
            title: 'Foo',
            isUnderCurrentDocsTree: true
          }
        ],
        frontMatter: {
          asIndexPage: true
        },
        type: 'doc',
        title: 'Themes Test',
        isUnderCurrentDocsTree: true
      }
    ])
  })

  it('firstChildRoute should return "index" route as first', async () => {
    const pageMap = await getPageMapForFixture(
      'first-child-route-should-return-index-as-first'
    )
    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/'
    })
    // @ts-expect-error -- fixme
    expect(normalizedResult.topLevelNavbarItems[0].firstChildRoute).toBe(
      '/blog'
    )
  })

  it('should rename folder', async () => {
    const pageMap = await getPageMapForFixture('should-rename-folder')
    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/test/foo'
    })
    expect(
      normalizedResult.docsDirectories.find(o => o.name === 'test')!.title
    ).toBe('HELLO')
  })

  it('should move file with `index` name', async () => {
    const pageMap = await getPageMapForFixture(
      'should-move-file-with-index-name'
    )
    const normalizedResult = normalizePages({
      list: pageMap,
      route: '/'
    })
    expect(normalizedResult.docsDirectories[0]!.name).toBe('foo')
    expect(normalizedResult.docsDirectories[1]!.name).toBe('index')
  })

  it('non-english characters in filename', async () => {
    const pageMap = await getPageMapForFixture(
      'non-english-characters-in-filename'
    )
    expect(pageMap).toBeInstanceOf(Array)
  })

  it('title priority', async () => {
    const pageMap = await getPageMapForFixture('title')
    expect(pageMap).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "1-meta": {
              "title": "from meta",
            },
            "2-sidebar-title": {
              "title": "",
            },
            "3-title": {
              "title": "",
            },
            "4-from-filename": {
              "title": "",
            },
            "_": {
              "type": "separator",
            },
            "_2": {
              "title": "separator with title",
              "type": "separator",
            },
            "folder": {
              "title": "from meta",
            },
            "folder-with-index": {
              "title": "",
            },
          },
        },
        {
          "name": "_",
          "type": "separator",
        },
        {
          "children": [
            {
              "frontMatter": undefined,
              "name": "index",
              "route": "/folder",
              "title": "Index",
            },
            {
              "frontMatter": undefined,
              "name": "bar",
              "route": "/folder/bar",
              "title": "Bar",
            },
          ],
          "name": "folder",
          "route": "/folder",
          "title": "from meta",
        },
        {
          "children": [
            {
              "frontMatter": undefined,
              "name": "foo",
              "route": "/folder-with-index/foo",
              "title": "Foo",
            },
          ],
          "frontMatter": {
            "asIndexPage": true,
            "sidebarTitle": "from sidebarTitle",
            "title": "from title",
          },
          "name": "folder-with-index",
          "route": "/folder-with-index",
          "title": "from sidebarTitle",
        },
        {
          "frontMatter": {
            "sidebarTitle": "from sidebarTitle",
            "title": "from title",
          },
          "name": "1-meta",
          "route": "/1-meta",
          "title": "from meta",
        },
        {
          "frontMatter": {
            "sidebarTitle": "from sidebarTitle",
            "title": "from title",
          },
          "name": "2-sidebar-title",
          "route": "/2-sidebar-title",
          "title": "from sidebarTitle",
        },
        {
          "frontMatter": {
            "title": "from title",
          },
          "name": "3-title",
          "route": "/3-title",
          "title": "from title",
        },
        {
          "frontMatter": undefined,
          "name": "4-from-filename",
          "route": "/4-from-filename",
          "title": "4 from Filename",
        },
        {
          "name": "_2",
          "title": "separator with title",
          "type": "separator",
        },
      ]
    `)
  })
})
