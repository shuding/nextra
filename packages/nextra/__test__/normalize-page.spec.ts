import { normalizePages } from '../src/client/normalize-pages.js'
import { normalizePageMap } from '../src/server/normalize-page-map.js'
import { cnPageMap, usPageMap } from './fixture/page-maps/pageMap.js'

describe('normalize-page', () => {
  it('zh-CN home', () => {
    const result = normalizePages({
      list: normalizePageMap(cnPageMap),
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('zh-CN getting-started', () => {
    const result = normalizePages({
      list: normalizePageMap(cnPageMap),
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

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

  // https://github.com/shuding/nextra/issues/1888
  it.skip('should set `route: #` for `type: menu`', () => {
    const pageMap = [
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
    ]
    const result = normalizePages({
      list: normalizePageMap(pageMap),
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
})
