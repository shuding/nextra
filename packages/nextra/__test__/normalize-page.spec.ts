import fs from 'node:fs/promises'
import path from 'node:path'
import { normalizePages } from '../src/client/normalize-pages.js'
import { cnPageMap, usPageMap } from './fixture/page-maps/page-map.js'

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
          "title": "Explorers3",
          "type": "menu",
        },
      ]
    `)
  })

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
})
