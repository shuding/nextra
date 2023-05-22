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
              kind: 'Folder',
              name: 'blog-theme',
              route: '/docs/blog-theme',
              children: [
                {
                  kind: 'Meta',
                  data: {
                    start: {
                      title: 'Get Started'
                    }
                  }
                },
                {
                  kind: 'MdxPage',
                  name: 'start',
                  route: '/docs/blog-theme/start'
                }
              ]
            },
            {
              kind: 'MdxPage',
              name: 'blog-theme',
              route: '/docs/blog-theme'
            },
            {
              kind: 'MdxPage',
              name: 'custom-theme',
              route: '/docs/custom-theme'
            },
            {
              kind: 'Folder',
              name: 'docs-theme',
              route: '/docs/docs-theme',
              children: [
                {
                  kind: 'Meta',
                  data: {
                    start: {
                      title: 'Get Started'
                    },
                    'page-configuration': {
                      title: 'Page Configuration'
                    },
                    'theme-configuration': {
                      title: 'Theme Configuration'
                    },
                    'built-ins': {
                      title: 'Built-ins'
                    }
                  }
                },
                {
                  kind: 'Folder',
                  name: 'built-ins',
                  route: '/docs/docs-theme/built-ins',
                  children: [
                    {
                      kind: 'MdxPage',
                      name: 'callout',
                      route: '/docs/docs-theme/built-ins/callout'
                    },
                    {
                      kind: 'MdxPage',
                      name: 'steps',
                      route: '/docs/docs-theme/built-ins/steps'
                    },
                    {
                      kind: 'MdxPage',
                      name: 'tabs',
                      route: '/docs/docs-theme/built-ins/tabs'
                    },
                    {
                      kind: 'Meta',
                      data: {
                        callout: {
                          title: 'Callout'
                        },
                        steps: {
                          title: 'Steps'
                        },
                        tabs: {
                          title: 'Tabs'
                        }
                      }
                    }
                  ]
                },
                {
                  kind: 'MdxPage',
                  name: 'built-ins',
                  route: '/docs/docs-theme/built-ins'
                },
                {
                  kind: 'MdxPage',
                  name: 'page-configuration',
                  route: '/docs/docs-theme/page-configuration'
                },
                {
                  kind: 'MdxPage',
                  name: 'start',
                  route: '/docs/docs-theme/start'
                },
                {
                  kind: 'MdxPage',
                  name: 'theme-configuration',
                  route: '/docs/docs-theme/theme-configuration'
                }
              ]
            },
            {
              kind: 'MdxPage',
              name: 'docs-theme',
              route: '/docs/docs-theme'
            },
            {
              kind: 'Folder',
              name: 'guide',
              route: '/docs/guide',
              children: [
                {
                  kind: 'Meta',
                  data: {
                    'organize-files': {
                      title: 'Organize Files'
                    },
                    markdown: {
                      title: 'Markdown'
                    },
                    'syntax-highlighting': {
                      title: 'Syntax Highlighting'
                    },
                    ssg: {
                      title: 'Next.js SSG'
                    },
                    i18n: {
                      title: 'Next.js I18n'
                    },
                    image: {
                      title: 'Next.js Image'
                    },
                    link: {
                      title: 'Next.js Link'
                    },
                    latex: {
                      title: 'LaTeX'
                    },
                    typescript: {
                      title: 'TypeScript'
                    },
                    advanced: {
                      title: 'Advanced'
                    }
                  }
                },
                {
                  kind: 'Folder',
                  name: 'advanced',
                  route: '/docs/guide/advanced',
                  children: [
                    {
                      kind: 'Meta',
                      data: {
                        table: {
                          title: 'Rendering Tables'
                        },
                        remote: {
                          title: 'Remote Content'
                        }
                      }
                    },
                    {
                      kind: 'MdxPage',
                      name: 'remote',
                      route: '/docs/guide/advanced/remote'
                    },
                    {
                      kind: 'MdxPage',
                      name: 'table',
                      route: '/docs/guide/advanced/table'
                    }
                  ]
                },
                {
                  kind: 'MdxPage',
                  name: 'advanced',
                  route: '/docs/guide/advanced'
                },
                {
                  kind: 'MdxPage',
                  name: 'i18n',
                  route: '/docs/guide/i18n'
                },
                {
                  kind: 'MdxPage',
                  name: 'image',
                  route: '/docs/guide/image'
                },
                {
                  kind: 'MdxPage',
                  name: 'latex',
                  route: '/docs/guide/latex'
                },
                {
                  kind: 'MdxPage',
                  name: 'link',
                  route: '/docs/guide/link'
                },
                {
                  kind: 'MdxPage',
                  name: 'markdown',
                  route: '/docs/guide/markdown'
                },
                {
                  kind: 'MdxPage',
                  name: 'organize-files',
                  route: '/docs/guide/organize-files'
                },
                {
                  kind: 'MdxPage',
                  name: 'ssg',
                  route: '/docs/guide/ssg'
                },
                {
                  kind: 'MdxPage',
                  name: 'syntax-highlighting',
                  route: '/docs/guide/syntax-highlighting'
                },
                {
                  kind: 'MdxPage',
                  name: 'typescript',
                  route: '/docs/guide/typescript'
                }
              ]
            },
            {
              kind: 'MdxPage',
              name: 'guide',
              route: '/docs/guide'
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
              "children": [
                {
                  "kind": "MdxPage",
                  "name": "organize-files",
                  "route": "/docs/guide/organize-files",
                  "title": "Organize Files",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "markdown",
                  "route": "/docs/guide/markdown",
                  "title": "Markdown",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "syntax-highlighting",
                  "route": "/docs/guide/syntax-highlighting",
                  "title": "Syntax Highlighting",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "ssg",
                  "route": "/docs/guide/ssg",
                  "title": "Next.js SSG",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "i18n",
                  "route": "/docs/guide/i18n",
                  "title": "Next.js I18n",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "image",
                  "route": "/docs/guide/image",
                  "title": "Next.js Image",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "link",
                  "route": "/docs/guide/link",
                  "title": "Next.js Link",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "latex",
                  "route": "/docs/guide/latex",
                  "title": "LaTeX",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "typescript",
                  "route": "/docs/guide/typescript",
                  "title": "TypeScript",
                  "type": "doc",
                },
                {
                  "children": [
                    {
                      "kind": "MdxPage",
                      "name": "table",
                      "route": "/docs/guide/advanced/table",
                      "title": "Rendering Tables",
                      "type": "doc",
                    },
                    {
                      "kind": "MdxPage",
                      "name": "remote",
                      "route": "/docs/guide/advanced/remote",
                      "title": "Remote Content",
                      "type": "doc",
                    },
                  ],
                  "kind": "MdxPage",
                  "name": "advanced",
                  "route": "/docs/guide/advanced",
                  "title": "Advanced",
                  "type": "doc",
                  "withIndexPage": true,
                },
              ],
              "kind": "MdxPage",
              "name": "guide",
              "route": "/docs/guide",
              "title": "Guide",
              "type": "doc",
              "withIndexPage": true,
            },
            {
              "isUnderCurrentDocsTree": true,
              "name": "-- Themes",
              "route": "",
              "title": "Themes",
              "type": "separator",
            },
            {
              "children": [
                {
                  "kind": "MdxPage",
                  "name": "start",
                  "route": "/docs/docs-theme/start",
                  "title": "Get Started",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "page-configuration",
                  "route": "/docs/docs-theme/page-configuration",
                  "title": "Page Configuration",
                  "type": "doc",
                },
                {
                  "kind": "MdxPage",
                  "name": "theme-configuration",
                  "route": "/docs/docs-theme/theme-configuration",
                  "title": "Theme Configuration",
                  "type": "doc",
                },
                {
                  "children": [
                    {
                      "kind": "MdxPage",
                      "name": "callout",
                      "route": "/docs/docs-theme/built-ins/callout",
                      "title": "Callout",
                      "type": "doc",
                    },
                    {
                      "kind": "MdxPage",
                      "name": "steps",
                      "route": "/docs/docs-theme/built-ins/steps",
                      "title": "Steps",
                      "type": "doc",
                    },
                    {
                      "kind": "MdxPage",
                      "name": "tabs",
                      "route": "/docs/docs-theme/built-ins/tabs",
                      "title": "Tabs",
                      "type": "doc",
                    },
                  ],
                  "kind": "MdxPage",
                  "name": "built-ins",
                  "route": "/docs/docs-theme/built-ins",
                  "title": "Built-ins",
                  "type": "doc",
                  "withIndexPage": true,
                },
              ],
              "kind": "MdxPage",
              "name": "docs-theme",
              "route": "/docs/docs-theme",
              "title": "Docs Theme",
              "type": "doc",
              "withIndexPage": true,
            },
            {
              "children": [
                {
                  "kind": "MdxPage",
                  "name": "start",
                  "route": "/docs/blog-theme/start",
                  "title": "Get Started",
                  "type": "doc",
                },
              ],
              "kind": "MdxPage",
              "name": "blog-theme",
              "route": "/docs/blog-theme",
              "title": "Blog Theme",
              "type": "doc",
              "withIndexPage": true,
            },
            {
              "kind": "MdxPage",
              "name": "custom-theme",
              "route": "/docs/custom-theme",
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
