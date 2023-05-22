import { describe, it, expect } from 'vitest'
import { cnPageMap, usPageMap } from './__fixture__/pageMap'
import { normalizePages } from 'nextra/normalize-pages'

const defaultLocale = 'en-US'

describe('normalize-page', () => {
  it('zh-CN home', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('zh-CN getting-started', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US home', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US getting-started', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('/404 page', () => {
    const result = normalizePages({
      list: [
        { kind: 'MdxPage', name: '404', route: '/404' },
        { kind: 'MdxPage', name: 'get-started', route: '/get-started' },
        { kind: 'MdxPage', name: 'index', route: '/' },
        {
          kind: 'Meta',
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
      locale: 'en-US',
      defaultLocale: 'en-US',
      route: '/500ddd'
    })
    expect(result).toMatchSnapshot()
  })

  it('/500 page', () => {
    const result = normalizePages({
      list: [
        { kind: 'MdxPage', name: '500', route: '/500' },
        { kind: 'MdxPage', name: 'get-started', route: '/get-started' },
        { kind: 'MdxPage', name: 'index', route: '/' },
        {
          kind: 'Meta',
          data: {
            '500': {
              type: 'page',
              theme: {
                layout: 'raw'
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
      locale: 'en-US',
      defaultLocale: 'en-US',
      route: '/500'
    })
    expect(result).toMatchSnapshot()
  })

  it('should ', () => {
    const result = normalizePages({
      list: [
        {
          kind: 'Meta',
          data: {
            index: {
              type: 'page',
              title: 'Nextra',
              display: 'hidden',
              theme: {
                layout: 'raw'
              }
            },
            docs: {
              type: 'page',
              title: 'Documentation'
            },
            explorers: {
              title: 'Explorers',
              type: 'menu',
              items: {
                status: {
                  title: 'Protocol Status',
                  type: 'page',
                  href: 'https://status.internal.taiko.xyz',
                  newWindow: true
                },
                'l1-block-explorer': {
                  title: 'L1 Block Explorer',
                  href: 'https://sepolia.etherscan.io',
                  newWindow: true
                },
                'l2-block-explorer': {
                  title: 'L2 Block Explorer',
                  href: 'https://explorer.internal.taiko.xyz',
                  newWindow: true
                }
              }
            },
            showcase: {
              type: 'page',
              title: 'Showcase',
              theme: {
                typesetting: 'article',
                layout: 'full'
              }
            },
            explorers2: {
              title: 'Explorers2',
              type: 'menu',
              items: {
                status: {
                  title: 'Protocol Status',
                  type: 'page',
                  href: 'https://status.internal.taiko.xyz',
                  newWindow: true
                },
                'l1-block-explorer': {
                  title: 'L1 Block Explorer',
                  href: 'https://sepolia.etherscan.io',
                  newWindow: true
                },
                'l2-block-explorer': {
                  title: 'L2 Block Explorer',
                  href: 'https://explorer.internal.taiko.xyz',
                  newWindow: true
                }
              }
            },
            about: {
              type: 'page',
              title: 'About',
              theme: {
                typesetting: 'article'
              }
            },
            explorers3: {
              title: 'Explorers3',
              type: 'menu',
              items: {
                status: {
                  title: 'Protocol Status',
                  type: 'page',
                  href: 'https://status.internal.taiko.xyz',
                  newWindow: true
                },
                'l1-block-explorer': {
                  title: 'L1 Block Explorer',
                  href: 'https://sepolia.etherscan.io',
                  newWindow: true
                },
                'l2-block-explorer': {
                  title: 'L2 Block Explorer',
                  href: 'https://explorer.internal.taiko.xyz',
                  newWindow: true
                }
              }
            }
          }
        },
        {
          kind: 'MdxPage',
          name: 'about',
          route: '/about'
        },
        {
          kind: 'Folder',
          name: 'docs',
          route: '/docs',
          children: [
            {
              kind: 'Meta',
              data: {
                index: {
                  title: 'Introduction'
                },
                guide: {
                  title: 'Guide'
                },
                '-- Themes': {
                  type: 'separator',
                  title: 'Themes'
                },
                'docs-theme': {
                  title: 'Docs Theme'
                },
                'blog-theme': {
                  title: 'Blog Theme'
                },
                'custom-theme': {
                  title: 'Custom Theme'
                },
                '-- More': {
                  type: 'separator',
                  title: 'More'
                },
                'about-link': {
                  title: 'About Nextra',
                  href: '/about'
                },
                'next.js-link': {
                  title: 'Next.js Docs ↗',
                  href: 'https://nextjs.org?utm_source=nextra.site&utm_medium=referral&utm_campaign=sidebar',
                  newWindow: true
                }
              }
            },
            {
              kind: 'MdxPage',
              name: 'index',
              route: '/docs'
            }
          ]
        },
        {
          kind: 'MdxPage',
          name: 'index',
          route: '/',
          frontMatter: {
            title: 'Nextra – Next.js Static Site Generator'
          }
        },
        {
          kind: 'MdxPage',
          name: 'showcase',
          route: '/showcase'
        }
      ],
      locale: 'en-US',
      route: '/docs'
    })
    expect(result.topLevelNavbarItems).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "kind": "MdxPage",
              "name": "index",
              "route": "/docs",
              "title": "Introduction",
              "type": "doc",
            },
            {
              "name": "guide",
              "route": "#",
              "title": "Guide",
              "type": "doc",
            },
            {
              "isUnderCurrentDocsTree": true,
              "name": "-- Themes",
              "route": "#",
              "title": "Themes",
              "type": "separator",
            },
            {
              "name": "docs-theme",
              "route": "#",
              "title": "Docs Theme",
              "type": "doc",
            },
            {
              "name": "blog-theme",
              "route": "#",
              "title": "Blog Theme",
              "type": "doc",
            },
            {
              "name": "custom-theme",
              "route": "#",
              "title": "Custom Theme",
              "type": "doc",
            },
            {
              "isUnderCurrentDocsTree": true,
              "name": "-- More",
              "route": "#",
              "title": "More",
              "type": "separator",
            },
            {
              "href": "/about",
              "name": "about-link",
              "route": "#",
              "title": "About Nextra",
              "type": "doc",
            },
            {
              "href": "https://nextjs.org?utm_source=nextra.site&utm_medium=referral&utm_campaign=sidebar",
              "name": "next.js-link",
              "newWindow": true,
              "route": "#",
              "title": "Next.js Docs ↗",
              "type": "doc",
            },
          ],
          "firstChildRoute": "/docs",
          "kind": "Folder",
          "name": "docs",
          "route": "/docs",
          "title": "Documentation",
          "type": "page",
        },
        {
          "items": {
            "l1-block-explorer": {
              "href": "https://sepolia.etherscan.io",
              "newWindow": true,
              "title": "L1 Block Explorer",
            },
            "l2-block-explorer": {
              "href": "https://explorer.internal.taiko.xyz",
              "newWindow": true,
              "title": "L2 Block Explorer",
            },
            "status": {
              "href": "https://status.internal.taiko.xyz",
              "newWindow": true,
              "title": "Protocol Status",
              "type": "page",
            },
          },
          "name": "explorers",
          "route": "",
          "title": "Explorers",
          "type": "menu",
        },
        {
          "kind": "MdxPage",
          "name": "showcase",
          "route": "/showcase",
          "theme": {
            "layout": "full",
            "typesetting": "article",
          },
          "title": "Showcase",
          "type": "page",
        },
        {
          "items": {
            "l1-block-explorer": {
              "href": "https://sepolia.etherscan.io",
              "newWindow": true,
              "title": "L1 Block Explorer",
            },
            "l2-block-explorer": {
              "href": "https://explorer.internal.taiko.xyz",
              "newWindow": true,
              "title": "L2 Block Explorer",
            },
            "status": {
              "href": "https://status.internal.taiko.xyz",
              "newWindow": true,
              "title": "Protocol Status",
              "type": "page",
            },
          },
          "name": "explorers2",
          "route": "",
          "title": "Explorers2",
          "type": "menu",
        },
        {
          "kind": "MdxPage",
          "name": "about",
          "route": "/about",
          "theme": {
            "typesetting": "article",
          },
          "title": "About",
          "type": "page",
        },
        {
          "items": {
            "l1-block-explorer": {
              "href": "https://sepolia.etherscan.io",
              "newWindow": true,
              "title": "L1 Block Explorer",
            },
            "l2-block-explorer": {
              "href": "https://explorer.internal.taiko.xyz",
              "newWindow": true,
              "title": "L2 Block Explorer",
            },
            "status": {
              "href": "https://status.internal.taiko.xyz",
              "newWindow": true,
              "title": "Protocol Status",
              "type": "page",
            },
          },
          "name": "explorers3",
          "route": "#",
          "title": "Explorers3",
          "type": "menu",
        },
      ]
    `)
  })
})
