import path from 'node:path'
import { describe } from 'vitest'
import { CWD } from '../src/constants'
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
    expect(rawJs).toMatchInlineSnapshot(`
      "import meta0 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/_meta.ts\\";
      import meta1 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/_meta.ts\\";
      import meta2 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/blog/_meta.ts\\";
      import meta3 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/_meta.ts\\";
      import meta4 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/_meta.ts\\";
      import meta5 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/_meta.ts\\";
      import meta6 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/remote/graphql-eslint/_meta.ts\\";
      import meta7 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/remote/graphql-yoga/_meta.ts\\";
      export const pageMap = [{
        data: meta0
      }, {
        \\"name\\": \\"about\\",
        \\"route\\": \\"/en/about\\",
        children: [{
          data: meta1
        }, {
          name: \\"a-page\\",
          route: \\"/en/about/a-page\\",
          frontMatter: {}
        }, {
          name: \\"acknowledgement\\",
          route: \\"/en/about/acknowledgement\\",
          frontMatter: {}
        }, {
          name: \\"changelog\\",
          route: \\"/en/about/changelog\\",
          frontMatter: {}
        }, {
          name: \\"team\\",
          route: \\"/en/about/team\\",
          frontMatter: {}
        }]
      }, {
        \\"name\\": \\"blog\\",
        \\"route\\": \\"/en/blog\\",
        children: [{
          data: meta2
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
        \\"name\\": \\"docs\\",
        \\"route\\": \\"/en/docs\\",
        children: [{
          name: \\"404-500\\",
          route: \\"/en/docs/404-500\\",
          frontMatter: {}
        }, {
          data: meta3
        }, {
          \\"name\\": \\"advanced\\",
          \\"route\\": \\"/en/docs/advanced\\",
          children: [{
            data: meta5
          }, {
            name: \\"cache\\",
            route: \\"/en/docs/advanced/cache\\",
            frontMatter: {}
          }, {
            name: \\"code-highlighting\\",
            route: \\"/en/docs/advanced/code-highlighting\\",
            frontMatter: {}
          }, {
            name: \\"dynamic-markdown-import\\",
            route: \\"/en/docs/advanced/dynamic-markdown-import\\",
            frontMatter: {}
          }, {
            name: \\"file-name.with.DOTS\\",
            route: \\"/en/docs/advanced/file-name.with.DOTS\\",
            frontMatter: {}
          }, {
            name: \\"images\\",
            route: \\"/en/docs/advanced/images\\",
            frontMatter: {}
          }, {
            name: \\"markdown-import\\",
            route: \\"/en/docs/advanced/markdown-import\\",
            frontMatter: {}
          }, {
            \\"name\\": \\"more\\",
            \\"route\\": \\"/en/docs/advanced/more\\",
            children: [{
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/en/docs/advanced/more/loooooooooooooooooooong-title\\",
              frontMatter: {}
            }, {
              \\"name\\": \\"tree\\",
              \\"route\\": \\"/en/docs/advanced/more/tree\\",
              children: [{
                name: \\"one\\",
                route: \\"/en/docs/advanced/more/tree/one\\",
                frontMatter: {}
              }, {
                name: \\"three\\",
                route: \\"/en/docs/advanced/more/tree/three\\",
                frontMatter: {}
              }, {
                name: \\"two\\",
                route: \\"/en/docs/advanced/more/tree/two\\",
                frontMatter: {}
              }]
            }]
          }, {
            name: \\"performance\\",
            route: \\"/en/docs/advanced/performance\\",
            frontMatter: {}
          }, {
            name: \\"react-native\\",
            route: \\"/en/docs/advanced/react-native\\",
            frontMatter: {}
          }, {
            name: \\"scrollbar-x\\",
            route: \\"/en/docs/advanced/scrollbar-x\\",
            frontMatter: {}
          }]
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\",
          frontMatter: {}
        }, {
          name: \\"arguments\\",
          route: \\"/en/docs/arguments\\",
          frontMatter: {}
        }, {
          name: \\"callout\\",
          route: \\"/en/docs/callout\\",
          frontMatter: {}
        }, {
          name: \\"change-log\\",
          route: \\"/en/docs/change-log\\",
          frontMatter: {}
        }, {
          name: \\"code-block-without-language\\",
          route: \\"/en/docs/code-block-without-language\\",
          frontMatter: {}
        }, {
          name: \\"conditional-fetching\\",
          route: \\"/en/docs/conditional-fetching\\",
          frontMatter: {}
        }, {
          name: \\"custom-header-ids\\",
          route: \\"/en/docs/custom-header-ids\\",
          frontMatter: {}
        }, {
          name: \\"data-fetching\\",
          route: \\"/en/docs/data-fetching\\",
          frontMatter: {}
        }, {
          name: \\"error-handling\\",
          route: \\"/en/docs/error-handling\\",
          frontMatter: {}
        }, {
          name: \\"getting-started\\",
          route: \\"/en/docs/getting-started\\",
          frontMatter: {}
        }, {
          name: \\"global-configuration\\",
          route: \\"/en/docs/global-configuration\\",
          frontMatter: {}
        }, {
          name: \\"middleware\\",
          route: \\"/en/docs/middleware\\",
          frontMatter: {}
        }, {
          name: \\"mutation\\",
          route: \\"/en/docs/mutation\\",
          frontMatter: {}
        }, {
          name: \\"options\\",
          route: \\"/en/docs/options\\",
          frontMatter: {}
        }, {
          name: \\"pagination\\",
          route: \\"/en/docs/pagination\\",
          frontMatter: {}
        }, {
          name: \\"prefetching\\",
          route: \\"/en/docs/prefetching\\",
          frontMatter: {}
        }, {
          name: \\"raw-layout\\",
          route: \\"/en/docs/raw-layout\\",
          frontMatter: {}
        }, {
          name: \\"revalidation\\",
          route: \\"/en/docs/revalidation\\",
          frontMatter: {}
        }, {
          name: \\"suspense\\",
          route: \\"/en/docs/suspense\\",
          frontMatter: {}
        }, {
          name: \\"typescript\\",
          route: \\"/en/docs/typescript\\",
          frontMatter: {}
        }, {
          name: \\"understanding\\",
          route: \\"/en/docs/understanding\\",
          frontMatter: {}
        }, {
          name: \\"with-nextjs\\",
          route: \\"/en/docs/with-nextjs\\",
          frontMatter: {}
        }, {
          name: \\"wrap-toc-items\\",
          route: \\"/en/docs/wrap-toc-items\\",
          frontMatter: {}
        }]
      }, {
        \\"name\\": \\"examples\\",
        \\"route\\": \\"/en/examples\\",
        children: [{
          data: meta4
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
          route: \\"/en/examples/full\\",
          frontMatter: {}
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
        route: \\"/en/foo\\",
        frontMatter: {}
      }, {
        name: \\"index\\",
        route: \\"/en\\",
        frontMatter: {
          \\"title\\": \\"React Hooks for Data Fetching\\",
          \\"searchable\\": false
        }
      }, {
        \\"name\\": \\"remote\\",
        \\"route\\": \\"/en/remote\\",
        children: [{
          \\"name\\": \\"graphql-eslint\\",
          \\"route\\": \\"/en/remote/graphql-eslint\\",
          children: [{
            data: {}
          }]
        }, {
          \\"name\\": \\"graphql-yoga\\",
          \\"route\\": \\"/en/remote/graphql-yoga\\",
          children: [{
            data: {}
          }]
        }]
      }, {
        name: \\"test\\",
        route: \\"/en/test\\",
        frontMatter: {}
      }];
      export const dynamicMetaModules = {
        '/en/remote/graphql-eslint': meta6,
        '/en/remote/graphql-yoga': meta7
      };
      "
    `)
  })
})
