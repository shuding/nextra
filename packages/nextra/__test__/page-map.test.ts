import path from 'node:path'
import { CWD } from '../src/server/constants'
import { collectPageMap } from '../src/server/page-map'

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
    const rawJs = await collectPageMap({ dir, route: '/en' })

    // To fix tests on CI
    const rawJsWithCleanImportPath = rawJs.replaceAll(
      /import meta\d+ from "(?<name>.*)"/g,
      (matched, capture) =>
        matched.replace(capture, path.relative(CWD, capture))
    )

    expect(rawJsWithCleanImportPath).toMatchInlineSnapshot(`
      "import examples_swr_site_pages_en_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/_meta.json\\";
      import examples_swr_site_pages_en_about_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/_meta.ts\\";
      import examples_swr_site_pages_en_blog_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/blog/_meta.ts\\";
      import examples_swr_site_pages_en_docs_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/_meta.ts\\";
      import examples_swr_site_pages_en_examples_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/_meta.ts\\";
      import examples_swr_site_pages_en_docs_advanced_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/_meta.ts\\";
      import examples_swr_site_pages_en_remote_graphql_eslint_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/remote/graphql-eslint/_meta.ts\\";
      import examples_swr_site_pages_en_remote_graphql_yoga_meta from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/remote/graphql-yoga/_meta.ts\\";
      export const pageMap = [{
        data: examples_swr_site_pages_en_meta
      }, {
        name: \\"about\\",
        route: \\"/en/about\\",
        children: [{
          data: examples_swr_site_pages_en_about_meta
        }, {
          name: \\"a-page\\",
          route: \\"/en/about/a-page\\"
        }, {
          name: \\"acknowledgement\\",
          route: \\"/en/about/acknowledgement\\"
        }, {
          name: \\"changelog\\",
          route: \\"/en/about/changelog\\"
        }, {
          name: \\"team\\",
          route: \\"/en/about/team\\"
        }]
      }, {
        name: \\"blog\\",
        route: \\"/en/blog\\",
        children: [{
          data: examples_swr_site_pages_en_blog_meta
        }, {
          name: \\"swr-v1\\",
          route: \\"/en/blog/swr-v1\\",
          frontMatter: {
            \\"image\\": \\"https://assets.vercel.com/image/upload/v1630059453/swr/v1.png\\",
            \\"description\\": \\"Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR.\\"
          }
        }]
      }, {
        name: \\"blog\\",
        route: \\"/en/blog\\",
        frontMatter: {
          \\"searchable\\": false
        }
      }, {
        name: \\"docs\\",
        route: \\"/en/docs\\",
        children: [{
          data: examples_swr_site_pages_en_docs_meta
        }, {
          name: \\"404-500\\",
          route: \\"/en/docs/404-500\\"
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\",
          children: [{
            data: examples_swr_site_pages_en_docs_advanced_meta
          }, {
            name: \\"cache\\",
            route: \\"/en/docs/advanced/cache\\"
          }, {
            name: \\"code-highlighting\\",
            route: \\"/en/docs/advanced/code-highlighting\\"
          }, {
            name: \\"dynamic-markdown-import\\",
            route: \\"/en/docs/advanced/dynamic-markdown-import\\"
          }, {
            name: \\"file-name.with.DOTS\\",
            route: \\"/en/docs/advanced/file-name.with.DOTS\\"
          }, {
            name: \\"images\\",
            route: \\"/en/docs/advanced/images\\"
          }, {
            name: \\"markdown-import\\",
            route: \\"/en/docs/advanced/markdown-import\\"
          }, {
            name: \\"more\\",
            route: \\"/en/docs/advanced/more\\",
            children: [{
              data: {
                \\"loooooooooooooooooooong-title\\": \\"Loooooooooooooooooooong Title\\",
                \\"tree\\": \\"Tree\\"
              }
            }, {
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/en/docs/advanced/more/loooooooooooooooooooong-title\\"
            }, {
              name: \\"tree\\",
              route: \\"/en/docs/advanced/more/tree\\",
              children: [{
                data: {
                  \\"one\\": \\"One\\",
                  \\"three\\": \\"Three\\",
                  \\"two\\": \\"Two\\"
                }
              }, {
                name: \\"one\\",
                route: \\"/en/docs/advanced/more/tree/one\\"
              }, {
                name: \\"three\\",
                route: \\"/en/docs/advanced/more/tree/three\\"
              }, {
                name: \\"two\\",
                route: \\"/en/docs/advanced/more/tree/two\\"
              }]
            }]
          }, {
            name: \\"performance\\",
            route: \\"/en/docs/advanced/performance\\"
          }, {
            name: \\"react-native\\",
            route: \\"/en/docs/advanced/react-native\\"
          }, {
            name: \\"scrollbar-x\\",
            route: \\"/en/docs/advanced/scrollbar-x\\"
          }]
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\"
        }, {
          name: \\"arguments\\",
          route: \\"/en/docs/arguments\\"
        }, {
          name: \\"callout\\",
          route: \\"/en/docs/callout\\"
        }, {
          name: \\"change-log\\",
          route: \\"/en/docs/change-log\\"
        }, {
          name: \\"code-block-without-language\\",
          route: \\"/en/docs/code-block-without-language\\"
        }, {
          name: \\"conditional-fetching\\",
          route: \\"/en/docs/conditional-fetching\\"
        }, {
          name: \\"custom-header-ids\\",
          route: \\"/en/docs/custom-header-ids\\"
        }, {
          name: \\"data-fetching\\",
          route: \\"/en/docs/data-fetching\\"
        }, {
          name: \\"error-handling\\",
          route: \\"/en/docs/error-handling\\"
        }, {
          name: \\"getting-started\\",
          route: \\"/en/docs/getting-started\\"
        }, {
          name: \\"global-configuration\\",
          route: \\"/en/docs/global-configuration\\"
        }, {
          name: \\"middleware\\",
          route: \\"/en/docs/middleware\\"
        }, {
          name: \\"mutation\\",
          route: \\"/en/docs/mutation\\"
        }, {
          name: \\"options\\",
          route: \\"/en/docs/options\\"
        }, {
          name: \\"pagination\\",
          route: \\"/en/docs/pagination\\"
        }, {
          name: \\"prefetching\\",
          route: \\"/en/docs/prefetching\\"
        }, {
          name: \\"raw-layout\\",
          route: \\"/en/docs/raw-layout\\"
        }, {
          name: \\"revalidation\\",
          route: \\"/en/docs/revalidation\\"
        }, {
          name: \\"suspense\\",
          route: \\"/en/docs/suspense\\"
        }, {
          name: \\"typescript\\",
          route: \\"/en/docs/typescript\\"
        }, {
          name: \\"understanding\\",
          route: \\"/en/docs/understanding\\"
        }, {
          name: \\"with-nextjs\\",
          route: \\"/en/docs/with-nextjs\\"
        }, {
          name: \\"wrap-toc-items\\",
          route: \\"/en/docs/wrap-toc-items\\"
        }]
      }, {
        name: \\"examples\\",
        route: \\"/en/examples\\",
        children: [{
          data: examples_swr_site_pages_en_examples_meta
        }, {
          name: \\"auth\\",
          route: \\"/en/examples/auth\\",
          frontMatter: {
            \\"title\\": \\"Authentication\\",
            \\"full\\": true
          }
        }, {
          name: \\"basic\\",
          route: \\"/en/examples/basic\\",
          frontMatter: {
            \\"title\\": \\"Basic Usage\\",
            \\"full\\": true
          }
        }, {
          name: \\"error-handling\\",
          route: \\"/en/examples/error-handling\\",
          frontMatter: {
            \\"title\\": \\"Error Handling\\",
            \\"full\\": true
          }
        }, {
          name: \\"full\\",
          route: \\"/en/examples/full\\"
        }, {
          name: \\"infinite-loading\\",
          route: \\"/en/examples/infinite-loading\\",
          frontMatter: {
            \\"title\\": \\"Infinite Loading\\",
            \\"full\\": true
          }
        }, {
          name: \\"ssr\\",
          route: \\"/en/examples/ssr\\",
          frontMatter: {
            \\"title\\": \\"Next.js SSR\\",
            \\"full\\": true
          }
        }]
      }, {
        name: \\"foo\\",
        route: \\"/en/foo\\"
      }, {
        name: \\"index\\",
        route: \\"/en\\",
        frontMatter: {
          \\"title\\": \\"React Hooks for Data Fetching\\",
          \\"searchable\\": false
        }
      }, {
        name: \\"remote\\",
        route: \\"/en/remote\\",
        children: [{
          data: {
            \\"graphql-eslint\\": \\"GraphQL Eslint\\",
            \\"graphql-yoga\\": \\"GraphQL Yoga\\"
          }
        }, {
          name: \\"graphql-eslint\\",
          route: \\"/en/remote/graphql-eslint\\",
          children: [{
            data: {}
          }]
        }, {
          name: \\"graphql-yoga\\",
          route: \\"/en/remote/graphql-yoga\\",
          children: [{
            data: {}
          }]
        }]
      }, {
        name: \\"test\\",
        route: \\"/en/test\\"
      }];
      export const dynamicMetaModules = {
        \\"/en/remote/graphql-eslint\\": examples_swr_site_pages_en_remote_graphql_eslint_meta,
        \\"/en/remote/graphql-yoga\\": examples_swr_site_pages_en_remote_graphql_yoga_meta
      };"
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
    expect(rawJs).toMatchInlineSnapshot(`
      "export const pageMap = [{
        data: {}
      }];
      export const dynamicMetaModules = {};"
    `)
  })

  it("should add `_meta.json` file if it's missing", async () => {
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
        data: {
          \\"callout\\": \\"Callout\\",
          \\"tabs\\": \\"Tabs\\"
        }
      }, {
        name: \\"callout\\",
        route: \\"/callout\\"
      }, {
        name: \\"tabs\\",
        route: \\"/tabs\\"
      }];
      export const dynamicMetaModules = {};"
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
        data: {
          \\"docs\\": \\"Docs\\",
          \\"test1\\": \\"Test1\\"
        }
      }, {
        name: \\"docs\\",
        route: \\"/docs\\",
        children: [{
          data: {
            \\"test2\\": \\"Test2\\"
          }
        }, {
          name: \\"test2\\",
          route: \\"/docs/test2\\"
        }]
      }, {
        name: \\"test1\\",
        route: \\"/test1\\"
      }];
      export const dynamicMetaModules = {};"
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
