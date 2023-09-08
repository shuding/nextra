import path from 'node:path'
import { describe } from 'vitest'
import { CWD } from '../src/constants'
import { toPageMap } from '../src/server/to-page-map'

describe('toPageMap', () => {
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
    const res = await toPageMap({ dir })
    expect(res.rawJs).toMatchInlineSnapshot(`
      "import meta0 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/_meta.json\\";
      import meta1 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/_meta.json\\";
      import meta2 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/blog/_meta.json\\";
      import meta3 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/_meta.json\\";
      import meta4 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/_meta.json\\";
      import meta5 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/_meta.json\\";
      export const pageMap = [{
        data: meta0
      }, {
        \\"name\\": \\"about\\",
        \\"route\\": \\"/about\\",
        children: [{
          data: meta1
        }, {
          name: \\"a-page\\",
          route: \\"/about/a-page\\",
          frontMatter: {}
        }, {
          name: \\"acknowledgement\\",
          route: \\"/about/acknowledgement\\",
          frontMatter: {}
        }, {
          name: \\"changelog\\",
          route: \\"/about/changelog\\",
          frontMatter: {}
        }, {
          name: \\"team\\",
          route: \\"/about/team\\",
          frontMatter: {}
        }]
      }, {
        \\"name\\": \\"blog\\",
        \\"route\\": \\"/blog\\",
        children: [{
          data: meta2
        }, {
          name: \\"swr-v1\\",
          route: \\"/blog/swr-v1\\",
          frontMatter: {
            \\"image\\": \\"https://assets.vercel.com/image/upload/v1630059453/swr/v1.png\\",
            \\"description\\": \\"Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR.\\"
          }
        }]
      }, {
        name: \\"blog\\",
        route: \\"/blog\\",
        frontMatter: {
          \\"searchable\\": false
        }
      }, {
        \\"name\\": \\"docs\\",
        \\"route\\": \\"/docs\\",
        children: [{
          name: \\"404-500\\",
          route: \\"/docs/404-500\\",
          frontMatter: {}
        }, {
          data: meta3
        }, {
          \\"name\\": \\"advanced\\",
          \\"route\\": \\"/docs/advanced\\",
          children: [{
            data: meta5
          }, {
            name: \\"cache\\",
            route: \\"/docs/advanced/cache\\",
            frontMatter: {}
          }, {
            name: \\"code-highlighting\\",
            route: \\"/docs/advanced/code-highlighting\\",
            frontMatter: {}
          }, {
            name: \\"dynamic-markdown-import\\",
            route: \\"/docs/advanced/dynamic-markdown-import\\",
            frontMatter: {}
          }, {
            name: \\"file-name.with.DOTS\\",
            route: \\"/docs/advanced/file-name.with.DOTS\\",
            frontMatter: {}
          }, {
            name: \\"images\\",
            route: \\"/docs/advanced/images\\",
            frontMatter: {}
          }, {
            name: \\"markdown-import\\",
            route: \\"/docs/advanced/markdown-import\\",
            frontMatter: {}
          }, {
            \\"name\\": \\"more\\",
            \\"route\\": \\"/docs/advanced/more\\",
            children: [{
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/docs/advanced/more/loooooooooooooooooooong-title\\",
              frontMatter: {}
            }, {
              \\"name\\": \\"tree\\",
              \\"route\\": \\"/docs/advanced/more/tree\\",
              children: [{
                name: \\"one\\",
                route: \\"/docs/advanced/more/tree/one\\",
                frontMatter: {}
              }, {
                name: \\"three\\",
                route: \\"/docs/advanced/more/tree/three\\",
                frontMatter: {}
              }, {
                name: \\"two\\",
                route: \\"/docs/advanced/more/tree/two\\",
                frontMatter: {}
              }]
            }]
          }, {
            name: \\"performance\\",
            route: \\"/docs/advanced/performance\\",
            frontMatter: {}
          }, {
            name: \\"react-native\\",
            route: \\"/docs/advanced/react-native\\",
            frontMatter: {}
          }, {
            name: \\"scrollbar-x\\",
            route: \\"/docs/advanced/scrollbar-x\\",
            frontMatter: {}
          }]
        }, {
          name: \\"advanced\\",
          route: \\"/docs/advanced\\",
          frontMatter: {}
        }, {
          name: \\"arguments\\",
          route: \\"/docs/arguments\\",
          frontMatter: {}
        }, {
          name: \\"callout\\",
          route: \\"/docs/callout\\",
          frontMatter: {}
        }, {
          name: \\"change-log\\",
          route: \\"/docs/change-log\\",
          frontMatter: {}
        }, {
          name: \\"code-block-without-language\\",
          route: \\"/docs/code-block-without-language\\",
          frontMatter: {}
        }, {
          name: \\"conditional-fetching\\",
          route: \\"/docs/conditional-fetching\\",
          frontMatter: {}
        }, {
          name: \\"custom-header-ids\\",
          route: \\"/docs/custom-header-ids\\",
          frontMatter: {}
        }, {
          name: \\"data-fetching\\",
          route: \\"/docs/data-fetching\\",
          frontMatter: {}
        }, {
          name: \\"error-handling\\",
          route: \\"/docs/error-handling\\",
          frontMatter: {}
        }, {
          name: \\"getting-started\\",
          route: \\"/docs/getting-started\\",
          frontMatter: {}
        }, {
          name: \\"global-configuration\\",
          route: \\"/docs/global-configuration\\",
          frontMatter: {}
        }, {
          name: \\"middleware\\",
          route: \\"/docs/middleware\\",
          frontMatter: {}
        }, {
          name: \\"mutation\\",
          route: \\"/docs/mutation\\",
          frontMatter: {}
        }, {
          name: \\"options\\",
          route: \\"/docs/options\\",
          frontMatter: {}
        }, {
          name: \\"pagination\\",
          route: \\"/docs/pagination\\",
          frontMatter: {}
        }, {
          name: \\"prefetching\\",
          route: \\"/docs/prefetching\\",
          frontMatter: {}
        }, {
          name: \\"raw-layout\\",
          route: \\"/docs/raw-layout\\",
          frontMatter: {}
        }, {
          name: \\"revalidation\\",
          route: \\"/docs/revalidation\\",
          frontMatter: {}
        }, {
          name: \\"suspense\\",
          route: \\"/docs/suspense\\",
          frontMatter: {}
        }, {
          name: \\"typescript\\",
          route: \\"/docs/typescript\\",
          frontMatter: {}
        }, {
          name: \\"understanding\\",
          route: \\"/docs/understanding\\",
          frontMatter: {}
        }, {
          name: \\"with-nextjs\\",
          route: \\"/docs/with-nextjs\\",
          frontMatter: {}
        }, {
          name: \\"wrap-toc-items\\",
          route: \\"/docs/wrap-toc-items\\",
          frontMatter: {}
        }]
      }, {
        \\"name\\": \\"examples\\",
        \\"route\\": \\"/examples\\",
        children: [{
          data: meta4
        }, {
          name: \\"auth\\",
          route: \\"/examples/auth\\",
          frontMatter: {
            \\"title\\": \\"Authentication\\",
            \\"full\\": true
          }
        }, {
          name: \\"basic\\",
          route: \\"/examples/basic\\",
          frontMatter: {
            \\"title\\": \\"Basic Usage\\",
            \\"full\\": true
          }
        }, {
          name: \\"error-handling\\",
          route: \\"/examples/error-handling\\",
          frontMatter: {
            \\"title\\": \\"Error Handling\\",
            \\"full\\": true
          }
        }, {
          name: \\"full\\",
          route: \\"/examples/full\\",
          frontMatter: {}
        }, {
          name: \\"infinite-loading\\",
          route: \\"/examples/infinite-loading\\",
          frontMatter: {
            \\"title\\": \\"Infinite Loading\\",
            \\"full\\": true
          }
        }, {
          name: \\"ssr\\",
          route: \\"/examples/ssr\\",
          frontMatter: {
            \\"title\\": \\"Next.js SSR\\",
            \\"full\\": true
          }
        }]
      }, {
        name: \\"foo\\",
        route: \\"/foo\\",
        frontMatter: {}
      }, {
        name: \\"index\\",
        route: \\"/\\",
        frontMatter: {
          \\"title\\": \\"React Hooks for Data Fetching\\",
          \\"searchable\\": false
        }
      }, {
        name: \\"test\\",
        route: \\"/test\\",
        frontMatter: {}
      }];
      "
    `)
  })
})
