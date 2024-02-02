import path from 'node:path'
import { CWD } from '../src/server/constants.js'
import { collectPageMap } from '../src/server/page-map.js'

vi.mock('next/dist/lib/find-pages-dir.js', () => ({
  findPagesDir: () => ({
    pagesDir: 'update me in related test'
  })
}))

describe('collectPageMap', () => {
  it('should work', async () => {
    const dir = path.join(
      CWD,
      '..',
      '..',
      'examples',
      'swr-site',
      'pages',
      'en'
    )
    const rawJs = await collectPageMap({ dir, route: '/en', locale: 'en' })

    expect(rawJs).toMatchInlineSnapshot(`
      "import examples_swr_site_pages_en_meta from "../../../../../examples/swr-site/pages/en/_meta.ts";
      import examples_swr_site_pages_en_about_meta from "../../../../../examples/swr-site/pages/en/about/_meta.ts";
      import examples_swr_site_pages_en_blog_meta from "../../../../../examples/swr-site/pages/en/blog/_meta.tsx";
      import examples_swr_site_pages_en_docs_meta from "../../../../../examples/swr-site/pages/en/docs/_meta.tsx";
      import examples_swr_site_pages_en_docs_advanced_meta from "../../../../../examples/swr-site/pages/en/docs/advanced/_meta.tsx";
      import examples_swr_site_pages_en_examples_meta from "../../../../../examples/swr-site/pages/en/examples/_meta.ts";
      import examples_swr_site_pages_en_remote_graphql_eslint_meta from "../../../../../examples/swr-site/pages/en/remote/graphql-eslint/_meta.ts";
      import examples_swr_site_pages_en_remote_graphql_yoga_meta from "../../../../../examples/swr-site/pages/en/remote/graphql-yoga/_meta.ts";
      export const pageMap = [{
        data: examples_swr_site_pages_en_meta
      }, {
        name: "about",
        route: "/en/about",
        children: [{
          data: examples_swr_site_pages_en_about_meta
        }, {
          name: "a-page",
          route: "/en/about/a-page",
          frontMatter: {
            "sidebarTitle": "A Page"
          }
        }, {
          name: "acknowledgement",
          route: "/en/about/acknowledgement",
          frontMatter: {
            "sidebarTitle": "Acknowledgement"
          }
        }, {
          name: "changelog",
          route: "/en/about/changelog",
          frontMatter: {
            "sidebarTitle": "Changelog"
          }
        }, {
          name: "team",
          route: "/en/about/team",
          frontMatter: {
            "sidebarTitle": "Team"
          }
        }]
      }, {
        name: "blog",
        route: "/en/blog",
        children: [{
          data: examples_swr_site_pages_en_blog_meta
        }, {
          name: "swr-v1",
          route: "/en/blog/swr-v1",
          frontMatter: {
            "title": "Announcing SWR 1.0",
            "image": "https://assets.vercel.com/image/upload/v1630059453/swr/v1.png",
            "description": "Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR",
            "date": new Date(1630022400000),
            "authors": [{
              "name": "Shu Ding",
              "link": "https://twitter.com/shuding_"
            }, {
              "name": "Jiachi Liu",
              "link": "https://twitter.com/huozhi"
            }]
          }
        }]
      }, {
        name: "blog",
        route: "/en/blog",
        frontMatter: {
          "searchable": false,
          "sidebarTitle": "Blog"
        }
      }, {
        name: "docs",
        route: "/en/docs",
        children: [{
          data: examples_swr_site_pages_en_docs_meta
        }, {
          name: "404-500",
          route: "/en/docs/404-500",
          frontMatter: {
            "sidebarTitle": "404 500"
          }
        }, {
          name: "advanced",
          route: "/en/docs/advanced",
          children: [{
            data: examples_swr_site_pages_en_docs_advanced_meta
          }, {
            name: "cache",
            route: "/en/docs/advanced/cache",
            frontMatter: {
              "sidebarTitle": "Cache"
            }
          }, {
            name: "code-highlighting",
            route: "/en/docs/advanced/code-highlighting",
            frontMatter: {
              "sidebarTitle": "Code Highlighting"
            }
          }, {
            name: "dynamic-markdown-import",
            route: "/en/docs/advanced/dynamic-markdown-import",
            frontMatter: {
              "sidebarTitle": "Dynamic Markdown Import"
            }
          }, {
            name: "file-name.with.DOTS",
            route: "/en/docs/advanced/file-name.with.DOTS",
            frontMatter: {
              "sidebarTitle": "File Name.with.dots"
            }
          }, {
            name: "images",
            route: "/en/docs/advanced/images",
            frontMatter: {
              "sidebarTitle": "Images"
            }
          }, {
            name: "markdown-import",
            route: "/en/docs/advanced/markdown-import",
            frontMatter: {
              "sidebarTitle": "Markdown Import"
            }
          }, {
            name: "more",
            route: "/en/docs/advanced/more",
            children: [{
              name: "loooooooooooooooooooong-title",
              route: "/en/docs/advanced/more/loooooooooooooooooooong-title",
              frontMatter: {
                "sidebarTitle": "Loooooooooooooooooooong Title"
              }
            }, {
              name: "tree",
              route: "/en/docs/advanced/more/tree",
              children: [{
                name: "one",
                route: "/en/docs/advanced/more/tree/one",
                frontMatter: {
                  "sidebarTitle": "One"
                }
              }, {
                name: "three",
                route: "/en/docs/advanced/more/tree/three",
                frontMatter: {
                  "sidebarTitle": "Three"
                }
              }, {
                name: "two",
                route: "/en/docs/advanced/more/tree/two",
                frontMatter: {
                  "sidebarTitle": "Two"
                }
              }]
            }]
          }, {
            name: "performance",
            route: "/en/docs/advanced/performance",
            frontMatter: {
              "sidebarTitle": "Performance"
            }
          }, {
            name: "react-native",
            route: "/en/docs/advanced/react-native",
            frontMatter: {
              "sidebarTitle": "React Native"
            }
          }, {
            name: "scrollbar-x",
            route: "/en/docs/advanced/scrollbar-x",
            frontMatter: {
              "sidebarTitle": "Scrollbar X"
            }
          }]
        }, {
          name: "advanced",
          route: "/en/docs/advanced",
          frontMatter: {
            "sidebarTitle": "Advanced"
          }
        }, {
          name: "arguments",
          route: "/en/docs/arguments",
          frontMatter: {
            "sidebarTitle": "Arguments"
          }
        }, {
          name: "callout",
          route: "/en/docs/callout",
          frontMatter: {
            "sidebarTitle": "Callout"
          }
        }, {
          name: "change-log",
          route: "/en/docs/change-log",
          frontMatter: {
            "sidebarTitle": "Change Log"
          }
        }, {
          name: "code-block-without-language",
          route: "/en/docs/code-block-without-language",
          frontMatter: {
            "sidebarTitle": "Code Block without Language"
          }
        }, {
          name: "conditional-fetching",
          route: "/en/docs/conditional-fetching",
          frontMatter: {
            "sidebarTitle": "Conditional Fetching"
          }
        }, {
          name: "custom-header-ids",
          route: "/en/docs/custom-header-ids",
          frontMatter: {
            "sidebarTitle": "Custom Header Ids"
          }
        }, {
          name: "data-fetching",
          route: "/en/docs/data-fetching",
          frontMatter: {
            "sidebarTitle": "Data Fetching"
          }
        }, {
          name: "error-handling",
          route: "/en/docs/error-handling",
          frontMatter: {
            "sidebarTitle": "Error Handling"
          }
        }, {
          name: "getting-started",
          route: "/en/docs/getting-started",
          frontMatter: {
            "sidebarTitle": "Getting Started"
          }
        }, {
          name: "global-configuration",
          route: "/en/docs/global-configuration",
          frontMatter: {
            "sidebarTitle": "Global Configuration"
          }
        }, {
          name: "middleware",
          route: "/en/docs/middleware",
          frontMatter: {
            "sidebarTitle": "Middleware"
          }
        }, {
          name: "mutation",
          route: "/en/docs/mutation",
          frontMatter: {
            "sidebarTitle": "Mutation"
          }
        }, {
          name: "options",
          route: "/en/docs/options",
          frontMatter: {
            "sidebarTitle": "Options"
          }
        }, {
          name: "pagination",
          route: "/en/docs/pagination",
          frontMatter: {
            "sidebarTitle": "Pagination"
          }
        }, {
          name: "prefetching",
          route: "/en/docs/prefetching",
          frontMatter: {
            "sidebarTitle": "Prefetching"
          }
        }, {
          name: "raw-layout",
          route: "/en/docs/raw-layout",
          frontMatter: {
            "sidebarTitle": "Raw Layout"
          }
        }, {
          name: "revalidation",
          route: "/en/docs/revalidation",
          frontMatter: {
            "sidebarTitle": "Revalidation"
          }
        }, {
          name: "suspense",
          route: "/en/docs/suspense",
          frontMatter: {
            "sidebarTitle": "Suspense"
          }
        }, {
          name: "typescript",
          route: "/en/docs/typescript",
          frontMatter: {
            "sidebarTitle": "TypeScript"
          }
        }, {
          name: "understanding",
          route: "/en/docs/understanding",
          frontMatter: {
            "sidebarTitle": "Understanding"
          }
        }, {
          name: "with-nextjs",
          route: "/en/docs/with-nextjs",
          frontMatter: {
            "sidebarTitle": "With Nextjs"
          }
        }, {
          name: "wrap-toc-items",
          route: "/en/docs/wrap-toc-items",
          frontMatter: {
            "sidebarTitle": "Wrap Toc Items"
          }
        }]
      }, {
        name: "examples",
        route: "/en/examples",
        children: [{
          data: examples_swr_site_pages_en_examples_meta
        }, {
          name: "auth",
          route: "/en/examples/auth",
          frontMatter: {
            "title": "Authentication",
            "full": true
          }
        }, {
          name: "basic",
          route: "/en/examples/basic",
          frontMatter: {
            "title": "Basic Usage",
            "full": true
          }
        }, {
          name: "error-handling",
          route: "/en/examples/error-handling",
          frontMatter: {
            "title": "Error Handling",
            "full": true
          }
        }, {
          name: "full",
          route: "/en/examples/full",
          frontMatter: {
            "sidebarTitle": "Full"
          }
        }, {
          name: "infinite-loading",
          route: "/en/examples/infinite-loading",
          frontMatter: {
            "title": "Infinite Loading",
            "full": true
          }
        }, {
          name: "ssr",
          route: "/en/examples/ssr",
          frontMatter: {
            "title": "Next.js SSR",
            "full": true
          }
        }]
      }, {
        name: "foo",
        route: "/en/foo",
        frontMatter: {
          "sidebarTitle": "Foo"
        }
      }, {
        name: "index",
        route: "/en",
        frontMatter: {
          "title": "React Hooks for Data Fetching",
          "searchable": false
        }
      }, {
        name: "remote",
        route: "/en/remote",
        children: [{
          name: "graphql-eslint",
          route: "/en/remote/graphql-eslint",
          children: []
        }, {
          name: "graphql-yoga",
          route: "/en/remote/graphql-yoga",
          children: []
        }]
      }, {
        name: "test",
        route: "/en/test",
        frontMatter: {
          "sidebarTitle": "Test"
        }
      }];
      const dynamicMetaModules = {
        "/en/remote/graphql-eslint": examples_swr_site_pages_en_remote_graphql_eslint_meta,
        "/en/remote/graphql-yoga": examples_swr_site_pages_en_remote_graphql_yoga_meta
      };

      import { resolvePageMap } from 'nextra/page-map-dynamic'

      if (typeof window === 'undefined') {
        globalThis.__nextra_resolvePageMap ||= Object.create(null)
        globalThis.__nextra_resolvePageMap['en'] = resolvePageMap('en', dynamicMetaModules)
      }"
    `)
  })
})

describe('Page Process', () => {
  it("should not add `_meta.json` file if folder doesn't contain markdown files", async () => {
    const rawJs = await collectPageMap({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-markdown-files'
      )
    })
    expect(rawJs).toMatchInlineSnapshot('"export const pageMap = [];"')
  })

  it("should not add `_meta.json` file if it's missing", async () => {
    const rawJs = await collectPageMap({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-meta-json'
      )
    })
    expect(rawJs).toMatchInlineSnapshot(`
      "export const pageMap = [{
        name: "callout",
        route: "/callout",
        frontMatter: {
          "sidebarTitle": "Callout"
        }
      }, {
        name: "tabs",
        route: "/tabs",
        frontMatter: {
          "sidebarTitle": "Tabs"
        }
      }];"
    `)
  })

  it('should add folder for dynamic routes', async () => {
    const rawJs = await collectPageMap({
      dir: path.join(CWD, '__test__', 'fixture', 'page-maps', 'dynamic-route')
    })
    expect(rawJs).toMatchInlineSnapshot(`
      "import test_fixture_page_maps_dynamic_route_my_dir_meta from "../../../__test__/fixture/page-maps/dynamic-route/my-dir/_meta.ts";
      export const pageMap = [{
        name: "my-dir",
        route: "/my-dir",
        children: []
      }];
      const dynamicMetaModules = {
        "/my-dir": test_fixture_page_maps_dynamic_route_my_dir_meta
      };

      import { resolvePageMap } from 'nextra/page-map-dynamic'

      if (typeof window === 'undefined') {
        globalThis.__nextra_resolvePageMap ||= Object.create(null)
        globalThis.__nextra_resolvePageMap[''] = resolvePageMap('', dynamicMetaModules)
      }"
    `)
  })

  it('should resolve symlinked files and directories', async () => {
    const rawJs = await collectPageMap({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-with-symlinks',
        'pages'
      )
    })

    expect(rawJs).toMatchInlineSnapshot(`
      "export const pageMap = [{
        name: "docs",
        route: "/docs",
        children: [{
          name: "test2",
          route: "/docs/test2",
          frontMatter: {
            "sidebarTitle": "Test2"
          }
        }]
      }, {
        name: "test1",
        route: "/test1",
        frontMatter: {
          "sidebarTitle": "Test1"
        }
      }];"
    `)
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
