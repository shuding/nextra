import fs from 'fs/promises'
import path from 'node:path'
import { normalizePages } from '../src/client/normalize-pages.js'
import { collectPageMap } from '../src/server/page-map.js'
import { cnPageMap, usPageMap } from './fixture/page-maps/pageMap.js'

vi.mock('next/dist/lib/find-pages-dir.js', () => ({
  findPagesDir: () => ({
    pagesDir: 'update me in related test'
  })
}))

describe('normalize-page', () => {
  it('zh-CN home', () => {
    const result = normalizePages({
      list: cnPageMap,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('zh-CN getting-started', () => {
    const result = normalizePages({
      list: cnPageMap,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

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

  it('/500 page', () => {
    const result = normalizePages({
      list: [
        { name: '500', route: '/500' },
        { name: 'get-started', route: '/get-started' },
        { name: 'index', route: '/' },
        {
          data: {
            '500': {
              type: 'page',
              theme: {
                layout: 'raw'
              }
            },
            index: 'Introduction',
            'get-started': 'Get Started'
          }
        }
      ],
      route: '/500'
    })
    expect(result).toMatchSnapshot()
  })

  // https://github.com/shuding/nextra/issues/1888
  it('should set `route: #` for `type: menu`', () => {
    const result = normalizePages({
      list: [
        {
          data: {
            index: {
              type: 'page',
              title: 'Nextra',
              display: 'hidden'
            },
            docs: {
              type: 'page',
              title: 'Documentation'
            },
            explorers: {
              title: 'Explorers',
              type: 'menu'
            },
            showcase: {
              type: 'page',
              title: 'Showcase'
            },
            explorers2: {
              title: 'Explorers2',
              type: 'menu'
            },
            about: {
              type: 'page',
              title: 'About'
            },
            explorers3: {
              title: 'Explorers3',
              type: 'menu'
            }
          }
        },
        {
          name: 'about',
          route: '/about'
        },
        {
          name: 'showcase',
          route: '/showcase'
        }
      ],
      route: '/docs'
    })
    expect(result.topLevelNavbarItems).toMatchInlineSnapshot(`
      [
        {
          "name": "docs",
          "route": "",
          "title": "Documentation",
          "type": "page",
        },
        {
          "name": "explorers",
          "route": "",
          "title": "Explorers",
          "type": "menu",
        },
        {
          "name": "showcase",
          "route": "/showcase",
          "title": "Showcase",
          "type": "page",
        },
        {
          "name": "explorers2",
          "route": "",
          "title": "Explorers2",
          "type": "menu",
        },
        {
          "name": "about",
          "route": "/about",
          "title": "About",
          "type": "page",
        },
        {
          "name": "explorers3",
          "route": "#",
          "title": "Explorers3",
          "type": "menu",
        },
      ]
    `)
  })

  it('should hide items on mobile', async () => {
    const dir = path.join(
      __dirname,
      'fixture',
      'page-maps',
      'display-hidden-for-mobile'
    )
    let rawJs = await collectPageMap({ dir })
    // TODO: quick fix, found better approach
    rawJs = rawJs.replace(
      /.*/,
      '' +
        'import test_fixture_page_maps_display_hidden_for_mobile_meta from "./_meta.ts";'
    )

    await fs.writeFile(path.join(dir, 'generated-page-map.js'), rawJs)

    const { pageMap } = await import(
      './fixture/page-maps/display-hidden-for-mobile/generated-page-map.js'
    )
    const result = normalizePages({ list: pageMap, route: '/' })
    expect(result).toMatchInlineSnapshot(`
      {
        "activeIndex": 1,
        "activePath": [
          {
            "frontMatter": {
              "sidebar_label": "Index",
            },
            "name": "index",
            "route": "/",
            "title": "Index",
            "type": "doc",
          },
        ],
        "activeThemeContext": {
          "breadcrumb": true,
          "collapsed": false,
          "footer": true,
          "layout": "default",
          "navbar": true,
          "pagination": true,
          "sidebar": true,
          "timestamp": true,
          "toc": true,
          "typesetting": "default",
        },
        "activeType": "doc",
        "directories": [
          {
            "frontMatter": {
              "sidebar_label": "Index",
            },
            "name": "index",
            "route": "/",
            "title": "Index",
            "type": "doc",
          },
        ],
        "docsDirectories": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "frontMatter": {
                          "sidebar_label": "Qwe",
                        },
                        "isUnderCurrentDocsTree": true,
                        "name": "qwe",
                        "route": "/bar/baz/quz/qwe",
                        "title": "Qwe",
                        "type": "doc",
                      },
                    ],
                    "isUnderCurrentDocsTree": true,
                    "name": "quz",
                    "route": "/bar/baz/quz",
                    "title": "quz",
                    "type": "doc",
                  },
                ],
                "isUnderCurrentDocsTree": true,
                "name": "baz",
                "route": "/bar/baz",
                "title": "baz",
                "type": "doc",
              },
            ],
            "display": "hidden",
            "isUnderCurrentDocsTree": true,
            "name": "bar",
            "route": "/bar",
            "title": "bar",
            "type": "doc",
          },
          {
            "frontMatter": {
              "sidebar_label": "Index",
            },
            "isUnderCurrentDocsTree": true,
            "name": "index",
            "route": "/",
            "title": "Index",
            "type": "doc",
          },
        ],
        "flatDirectories": [
          {
            "frontMatter": {
              "sidebar_label": "Qwe",
            },
            "name": "qwe",
            "route": "/bar/baz/quz/qwe",
            "title": "Qwe",
            "type": "doc",
          },
          {
            "frontMatter": {
              "sidebar_label": "Index",
            },
            "name": "index",
            "route": "/",
            "title": "Index",
            "type": "doc",
          },
        ],
        "flatDocsDirectories": [
          {
            "frontMatter": {
              "sidebar_label": "Qwe",
            },
            "isUnderCurrentDocsTree": true,
            "name": "qwe",
            "route": "/bar/baz/quz/qwe",
            "title": "Qwe",
            "type": "doc",
          },
          {
            "frontMatter": {
              "sidebar_label": "Index",
            },
            "isUnderCurrentDocsTree": true,
            "name": "index",
            "route": "/",
            "title": "Index",
            "type": "doc",
          },
        ],
        "topLevelNavbarItems": [],
      }
    `)
  })
})
