import path from 'node:path'
import { CWD } from '../src/server/constants.js'
import { collectPageMap } from '../src/server/page-map.js'

function clean(content: string): string {
  return content.replace(/\s+const dynamicMetaModules.+/s, '')
}

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

    // To fix tests on CI
    const rawJsWithCleanImportPath = rawJs.replaceAll(
      /import \w+ from "(?<name>.*)"/g,
      (matched, capture) =>
        matched.replace(capture, path.relative(CWD, capture))
    )

    expect(rawJsWithCleanImportPath).toMatchInlineSnapshot(`
      "import examples_swr_site_pages_en_meta from \\"../../examples/swr-site/pages/en/_meta.json\\";
      import examples_swr_site_pages_en_about_meta from \\"../../examples/swr-site/pages/en/about/_meta.ts\\";
      import examples_swr_site_pages_en_blog_meta from \\"../../examples/swr-site/pages/en/blog/_meta.ts\\";
      import examples_swr_site_pages_en_docs_meta from \\"../../examples/swr-site/pages/en/docs/_meta.tsx\\";
      import examples_swr_site_pages_en_docs_advanced_meta from \\"../../examples/swr-site/pages/en/docs/advanced/_meta.ts\\";
      import examples_swr_site_pages_en_examples_meta from \\"../../examples/swr-site/pages/en/examples/_meta.ts\\";
      import examples_swr_site_pages_en_remote_graphql_eslint_meta from \\"../../examples/swr-site/pages/en/remote/graphql-eslint/_meta.ts\\";
      import examples_swr_site_pages_en_remote_graphql_yoga_meta from \\"../../examples/swr-site/pages/en/remote/graphql-yoga/_meta.ts\\";
      export const pageMap = [{
        data: examples_swr_site_pages_en_meta
      }, {
        name: \\"about\\",
        route: \\"/en/about\\",
        children: [{
          data: examples_swr_site_pages_en_about_meta
        }, {
          name: \\"a-page\\",
          route: \\"/en/about/a-page\\",
          frontMatter: {
            \\"sidebar_label\\": \\"A Page\\"
          }
        }, {
          name: \\"acknowledgement\\",
          route: \\"/en/about/acknowledgement\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Acknowledgement\\"
          }
        }, {
          name: \\"changelog\\",
          route: \\"/en/about/changelog\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Changelog\\"
          }
        }, {
          name: \\"team\\",
          route: \\"/en/about/team\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Team\\"
          }
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
            \\"sidebar_label\\": \\"SWR V1\\",
            \\"image\\": \\"https://assets.vercel.com/image/upload/v1630059453/swr/v1.png\\",
            \\"description\\": \\"Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR.\\"
          }
        }]
      }, {
        name: \\"blog\\",
        route: \\"/en/blog\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Blog\\",
          \\"searchable\\": false
        }
      }, {
        name: \\"docs\\",
        route: \\"/en/docs\\",
        children: [{
          data: examples_swr_site_pages_en_docs_meta
        }, {
          name: \\"404-500\\",
          route: \\"/en/docs/404-500\\",
          frontMatter: {
            \\"sidebar_label\\": \\"404 500\\"
          }
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\",
          children: [{
            data: examples_swr_site_pages_en_docs_advanced_meta
          }, {
            name: \\"cache\\",
            route: \\"/en/docs/advanced/cache\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Cache\\"
            }
          }, {
            name: \\"code-highlighting\\",
            route: \\"/en/docs/advanced/code-highlighting\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Code Highlighting\\"
            }
          }, {
            name: \\"dynamic-markdown-import\\",
            route: \\"/en/docs/advanced/dynamic-markdown-import\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Dynamic Markdown Import\\"
            }
          }, {
            name: \\"file-name.with.DOTS\\",
            route: \\"/en/docs/advanced/file-name.with.DOTS\\",
            frontMatter: {
              \\"sidebar_label\\": \\"File Name.with.dots\\"
            }
          }, {
            name: \\"images\\",
            route: \\"/en/docs/advanced/images\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Images\\"
            }
          }, {
            name: \\"markdown-import\\",
            route: \\"/en/docs/advanced/markdown-import\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Markdown Import\\"
            }
          }, {
            name: \\"more\\",
            route: \\"/en/docs/advanced/more\\",
            children: [{
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/en/docs/advanced/more/loooooooooooooooooooong-title\\",
              frontMatter: {
                \\"sidebar_label\\": \\"Loooooooooooooooooooong Title\\"
              }
            }, {
              name: \\"tree\\",
              route: \\"/en/docs/advanced/more/tree\\",
              children: [{
                name: \\"one\\",
                route: \\"/en/docs/advanced/more/tree/one\\",
                frontMatter: {
                  \\"sidebar_label\\": \\"One\\"
                }
              }, {
                name: \\"three\\",
                route: \\"/en/docs/advanced/more/tree/three\\",
                frontMatter: {
                  \\"sidebar_label\\": \\"Three\\"
                }
              }, {
                name: \\"two\\",
                route: \\"/en/docs/advanced/more/tree/two\\",
                frontMatter: {
                  \\"sidebar_label\\": \\"Two\\"
                }
              }]
            }]
          }, {
            name: \\"performance\\",
            route: \\"/en/docs/advanced/performance\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Performance\\"
            }
          }, {
            name: \\"react-native\\",
            route: \\"/en/docs/advanced/react-native\\",
            frontMatter: {
              \\"sidebar_label\\": \\"React Native\\"
            }
          }, {
            name: \\"scrollbar-x\\",
            route: \\"/en/docs/advanced/scrollbar-x\\",
            frontMatter: {
              \\"sidebar_label\\": \\"Scrollbar X\\"
            }
          }]
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Advanced\\"
          }
        }, {
          name: \\"arguments\\",
          route: \\"/en/docs/arguments\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Arguments\\"
          }
        }, {
          name: \\"callout\\",
          route: \\"/en/docs/callout\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Callout\\"
          }
        }, {
          name: \\"change-log\\",
          route: \\"/en/docs/change-log\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Change Log\\"
          }
        }, {
          name: \\"code-block-without-language\\",
          route: \\"/en/docs/code-block-without-language\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Code Block without Language\\"
          }
        }, {
          name: \\"conditional-fetching\\",
          route: \\"/en/docs/conditional-fetching\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Conditional Fetching\\"
          }
        }, {
          name: \\"custom-header-ids\\",
          route: \\"/en/docs/custom-header-ids\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Custom Header Ids\\"
          }
        }, {
          name: \\"data-fetching\\",
          route: \\"/en/docs/data-fetching\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Data Fetching\\"
          }
        }, {
          name: \\"error-handling\\",
          route: \\"/en/docs/error-handling\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Error Handling\\"
          }
        }, {
          name: \\"getting-started\\",
          route: \\"/en/docs/getting-started\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Getting Started\\"
          }
        }, {
          name: \\"global-configuration\\",
          route: \\"/en/docs/global-configuration\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Global Configuration\\"
          }
        }, {
          name: \\"middleware\\",
          route: \\"/en/docs/middleware\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Middleware\\"
          }
        }, {
          name: \\"mutation\\",
          route: \\"/en/docs/mutation\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Mutation\\"
          }
        }, {
          name: \\"options\\",
          route: \\"/en/docs/options\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Options\\"
          }
        }, {
          name: \\"pagination\\",
          route: \\"/en/docs/pagination\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Pagination\\"
          }
        }, {
          name: \\"prefetching\\",
          route: \\"/en/docs/prefetching\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Prefetching\\"
          }
        }, {
          name: \\"raw-layout\\",
          route: \\"/en/docs/raw-layout\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Raw Layout\\"
          }
        }, {
          name: \\"revalidation\\",
          route: \\"/en/docs/revalidation\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Revalidation\\"
          }
        }, {
          name: \\"suspense\\",
          route: \\"/en/docs/suspense\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Suspense\\"
          }
        }, {
          name: \\"typescript\\",
          route: \\"/en/docs/typescript\\",
          frontMatter: {
            \\"sidebar_label\\": \\"TypeScript\\"
          }
        }, {
          name: \\"understanding\\",
          route: \\"/en/docs/understanding\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Understanding\\"
          }
        }, {
          name: \\"with-nextjs\\",
          route: \\"/en/docs/with-nextjs\\",
          frontMatter: {
            \\"sidebar_label\\": \\"With Nextjs\\"
          }
        }, {
          name: \\"wrap-toc-items\\",
          route: \\"/en/docs/wrap-toc-items\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Wrap Toc Items\\"
          }
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
            \\"sidebar_label\\": \\"Auth\\",
            \\"title\\": \\"Authentication\\",
            \\"full\\": true
          }
        }, {
          name: \\"basic\\",
          route: \\"/en/examples/basic\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Basic\\",
            \\"title\\": \\"Basic Usage\\",
            \\"full\\": true
          }
        }, {
          name: \\"error-handling\\",
          route: \\"/en/examples/error-handling\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Error Handling\\",
            \\"title\\": \\"Error Handling\\",
            \\"full\\": true
          }
        }, {
          name: \\"full\\",
          route: \\"/en/examples/full\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Full\\"
          }
        }, {
          name: \\"infinite-loading\\",
          route: \\"/en/examples/infinite-loading\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Infinite Loading\\",
            \\"title\\": \\"Infinite Loading\\",
            \\"full\\": true
          }
        }, {
          name: \\"ssr\\",
          route: \\"/en/examples/ssr\\",
          frontMatter: {
            \\"sidebar_label\\": \\"SSR\\",
            \\"title\\": \\"Next.js SSR\\",
            \\"full\\": true
          }
        }]
      }, {
        name: \\"foo\\",
        route: \\"/en/foo\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Foo\\"
        }
      }, {
        name: \\"index\\",
        route: \\"/en\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Index\\",
          \\"title\\": \\"React Hooks for Data Fetching\\",
          \\"searchable\\": false
        }
      }, {
        name: \\"remote\\",
        route: \\"/en/remote\\",
        children: [{
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
        route: \\"/en/test\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Test\\"
        }
      }];
      const dynamicMetaModules = {
        \\"/en/remote/graphql-eslint\\": examples_swr_site_pages_en_remote_graphql_eslint_meta,
        \\"/en/remote/graphql-yoga\\": examples_swr_site_pages_en_remote_graphql_yoga_meta
      };

      import { resolvePageMap } from 'nextra/setup-page'

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
    expect(clean(rawJs)).toMatchInlineSnapshot('"export const pageMap = [];"')
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
    expect(clean(rawJs)).toMatchInlineSnapshot(`
      "export const pageMap = [{
        name: \\"callout\\",
        route: \\"/callout\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Callout\\"
        }
      }, {
        name: \\"tabs\\",
        route: \\"/tabs\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Tabs\\"
        }
      }];"
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

    expect(clean(rawJs)).toMatchInlineSnapshot(`
      "export const pageMap = [{
        name: \\"docs\\",
        route: \\"/docs\\",
        children: [{
          name: \\"test2\\",
          route: \\"/docs/test2\\",
          frontMatter: {
            \\"sidebar_label\\": \\"Test2\\"
          }
        }]
      }, {
        name: \\"test1\\",
        route: \\"/test1\\",
        frontMatter: {
          \\"sidebar_label\\": \\"Test1\\"
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
