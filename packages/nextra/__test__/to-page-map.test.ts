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
      import {frontMatter as frontMatter0} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/blog.mdx\\";
      import {frontMatter as frontMatter1} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/foo.md\\";
      import {frontMatter as frontMatter2} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/index.mdx\\";
      import {frontMatter as frontMatter3} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/test.md\\";
      import {frontMatter as frontMatter4} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/a-page.mdx\\";
      import {frontMatter as frontMatter5} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/acknowledgement.mdx\\";
      import {frontMatter as frontMatter6} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/changelog.md\\";
      import {frontMatter as frontMatter7} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/team.mdx\\";
      import {frontMatter as frontMatter8} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/blog/swr-v1.mdx\\";
      import {frontMatter as frontMatter9} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/404-500.mdx\\";
      import {frontMatter as frontMatter10} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced.mdx\\";
      import {frontMatter as frontMatter11} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/arguments.mdx\\";
      import {frontMatter as frontMatter12} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/callout.mdx\\";
      import {frontMatter as frontMatter13} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/change-log.mdx\\";
      import {frontMatter as frontMatter14} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/code-block-without-language.mdx\\";
      import {frontMatter as frontMatter15} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/conditional-fetching.md\\";
      import {frontMatter as frontMatter16} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/custom-header-ids.mdx\\";
      import {frontMatter as frontMatter17} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/data-fetching.mdx\\";
      import {frontMatter as frontMatter18} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/error-handling.mdx\\";
      import {frontMatter as frontMatter19} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/getting-started.mdx\\";
      import {frontMatter as frontMatter20} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/global-configuration.md\\";
      import {frontMatter as frontMatter21} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/middleware.mdx\\";
      import {frontMatter as frontMatter22} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/mutation.md\\";
      import {frontMatter as frontMatter23} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/options.mdx\\";
      import {frontMatter as frontMatter24} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/pagination.mdx\\";
      import {frontMatter as frontMatter25} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/prefetching.md\\";
      import {frontMatter as frontMatter26} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/raw-layout.mdx\\";
      import {frontMatter as frontMatter27} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/revalidation.mdx\\";
      import {frontMatter as frontMatter28} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/suspense.mdx\\";
      import {frontMatter as frontMatter29} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/typescript.mdx\\";
      import {frontMatter as frontMatter30} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/understanding.mdx\\";
      import {frontMatter as frontMatter31} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/with-nextjs.mdx\\";
      import {frontMatter as frontMatter32} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/wrap-toc-items.mdx\\";
      import {frontMatter as frontMatter33} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/auth.mdx\\";
      import {frontMatter as frontMatter34} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/basic.mdx\\";
      import {frontMatter as frontMatter35} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/error-handling.mdx\\";
      import {frontMatter as frontMatter36} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/full.mdx\\";
      import {frontMatter as frontMatter37} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/infinite-loading.mdx\\";
      import {frontMatter as frontMatter38} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/ssr.mdx\\";
      import {frontMatter as frontMatter39} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/cache.mdx\\";
      import {frontMatter as frontMatter40} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/code-highlighting.mdx\\";
      import {frontMatter as frontMatter41} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/dynamic-markdown-import.mdx\\";
      import {frontMatter as frontMatter42} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/file-name.with.DOTS.mdx\\";
      import {frontMatter as frontMatter43} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/images.mdx\\";
      import {frontMatter as frontMatter44} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/markdown-import.mdx\\";
      import {frontMatter as frontMatter45} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/performance.mdx\\";
      import {frontMatter as frontMatter46} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/react-native.mdx\\";
      import {frontMatter as frontMatter47} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/scrollbar-x.mdx\\";
      import {frontMatter as frontMatter48} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/more/loooooooooooooooooooong-title.mdx\\";
      import {frontMatter as frontMatter49} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/more/tree/one.mdx\\";
      import {frontMatter as frontMatter50} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/more/tree/three.mdx\\";
      import {frontMatter as frontMatter51} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/more/tree/two.mdx\\";
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
          frontMatter: frontMatter4
        }, {
          name: \\"acknowledgement\\",
          route: \\"/about/acknowledgement\\",
          frontMatter: frontMatter5
        }, {
          name: \\"changelog\\",
          route: \\"/about/changelog\\",
          frontMatter: frontMatter6
        }, {
          name: \\"team\\",
          route: \\"/about/team\\",
          frontMatter: frontMatter7
        }]
      }, {
        \\"name\\": \\"blog\\",
        \\"route\\": \\"/blog\\",
        children: [{
          data: meta2
        }, {
          name: \\"swr-v1\\",
          route: \\"/blog/swr-v1\\",
          frontMatter: frontMatter8
        }]
      }, {
        name: \\"blog\\",
        route: \\"/blog\\",
        frontMatter: frontMatter0
      }, {
        \\"name\\": \\"docs\\",
        \\"route\\": \\"/docs\\",
        children: [{
          name: \\"404-500\\",
          route: \\"/docs/404-500\\",
          frontMatter: frontMatter9
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
            frontMatter: frontMatter39
          }, {
            name: \\"code-highlighting\\",
            route: \\"/docs/advanced/code-highlighting\\",
            frontMatter: frontMatter40
          }, {
            name: \\"dynamic-markdown-import\\",
            route: \\"/docs/advanced/dynamic-markdown-import\\",
            frontMatter: frontMatter41
          }, {
            name: \\"file-name.with.DOTS\\",
            route: \\"/docs/advanced/file-name.with.DOTS\\",
            frontMatter: frontMatter42
          }, {
            name: \\"images\\",
            route: \\"/docs/advanced/images\\",
            frontMatter: frontMatter43
          }, {
            name: \\"markdown-import\\",
            route: \\"/docs/advanced/markdown-import\\",
            frontMatter: frontMatter44
          }, {
            \\"name\\": \\"more\\",
            \\"route\\": \\"/docs/advanced/more\\",
            children: [{
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/docs/advanced/more/loooooooooooooooooooong-title\\",
              frontMatter: frontMatter48
            }, {
              \\"name\\": \\"tree\\",
              \\"route\\": \\"/docs/advanced/more/tree\\",
              children: [{
                name: \\"one\\",
                route: \\"/docs/advanced/more/tree/one\\",
                frontMatter: frontMatter49
              }, {
                name: \\"three\\",
                route: \\"/docs/advanced/more/tree/three\\",
                frontMatter: frontMatter50
              }, {
                name: \\"two\\",
                route: \\"/docs/advanced/more/tree/two\\",
                frontMatter: frontMatter51
              }]
            }]
          }, {
            name: \\"performance\\",
            route: \\"/docs/advanced/performance\\",
            frontMatter: frontMatter45
          }, {
            name: \\"react-native\\",
            route: \\"/docs/advanced/react-native\\",
            frontMatter: frontMatter46
          }, {
            name: \\"scrollbar-x\\",
            route: \\"/docs/advanced/scrollbar-x\\",
            frontMatter: frontMatter47
          }]
        }, {
          name: \\"advanced\\",
          route: \\"/docs/advanced\\",
          frontMatter: frontMatter10
        }, {
          name: \\"arguments\\",
          route: \\"/docs/arguments\\",
          frontMatter: frontMatter11
        }, {
          name: \\"callout\\",
          route: \\"/docs/callout\\",
          frontMatter: frontMatter12
        }, {
          name: \\"change-log\\",
          route: \\"/docs/change-log\\",
          frontMatter: frontMatter13
        }, {
          name: \\"code-block-without-language\\",
          route: \\"/docs/code-block-without-language\\",
          frontMatter: frontMatter14
        }, {
          name: \\"conditional-fetching\\",
          route: \\"/docs/conditional-fetching\\",
          frontMatter: frontMatter15
        }, {
          name: \\"custom-header-ids\\",
          route: \\"/docs/custom-header-ids\\",
          frontMatter: frontMatter16
        }, {
          name: \\"data-fetching\\",
          route: \\"/docs/data-fetching\\",
          frontMatter: frontMatter17
        }, {
          name: \\"error-handling\\",
          route: \\"/docs/error-handling\\",
          frontMatter: frontMatter18
        }, {
          name: \\"getting-started\\",
          route: \\"/docs/getting-started\\",
          frontMatter: frontMatter19
        }, {
          name: \\"global-configuration\\",
          route: \\"/docs/global-configuration\\",
          frontMatter: frontMatter20
        }, {
          name: \\"middleware\\",
          route: \\"/docs/middleware\\",
          frontMatter: frontMatter21
        }, {
          name: \\"mutation\\",
          route: \\"/docs/mutation\\",
          frontMatter: frontMatter22
        }, {
          name: \\"options\\",
          route: \\"/docs/options\\",
          frontMatter: frontMatter23
        }, {
          name: \\"pagination\\",
          route: \\"/docs/pagination\\",
          frontMatter: frontMatter24
        }, {
          name: \\"prefetching\\",
          route: \\"/docs/prefetching\\",
          frontMatter: frontMatter25
        }, {
          name: \\"raw-layout\\",
          route: \\"/docs/raw-layout\\",
          frontMatter: frontMatter26
        }, {
          name: \\"revalidation\\",
          route: \\"/docs/revalidation\\",
          frontMatter: frontMatter27
        }, {
          name: \\"suspense\\",
          route: \\"/docs/suspense\\",
          frontMatter: frontMatter28
        }, {
          name: \\"typescript\\",
          route: \\"/docs/typescript\\",
          frontMatter: frontMatter29
        }, {
          name: \\"understanding\\",
          route: \\"/docs/understanding\\",
          frontMatter: frontMatter30
        }, {
          name: \\"with-nextjs\\",
          route: \\"/docs/with-nextjs\\",
          frontMatter: frontMatter31
        }, {
          name: \\"wrap-toc-items\\",
          route: \\"/docs/wrap-toc-items\\",
          frontMatter: frontMatter32
        }]
      }, {
        \\"name\\": \\"examples\\",
        \\"route\\": \\"/examples\\",
        children: [{
          data: meta4
        }, {
          name: \\"auth\\",
          route: \\"/examples/auth\\",
          frontMatter: frontMatter33
        }, {
          name: \\"basic\\",
          route: \\"/examples/basic\\",
          frontMatter: frontMatter34
        }, {
          name: \\"error-handling\\",
          route: \\"/examples/error-handling\\",
          frontMatter: frontMatter35
        }, {
          name: \\"full\\",
          route: \\"/examples/full\\",
          frontMatter: frontMatter36
        }, {
          name: \\"infinite-loading\\",
          route: \\"/examples/infinite-loading\\",
          frontMatter: frontMatter37
        }, {
          name: \\"ssr\\",
          route: \\"/examples/ssr\\",
          frontMatter: frontMatter38
        }]
      }, {
        name: \\"foo\\",
        route: \\"/foo\\",
        frontMatter: frontMatter1
      }, {
        name: \\"index\\",
        route: \\"/\\",
        frontMatter: frontMatter2
      }, {
        name: \\"test\\",
        route: \\"/test\\",
        frontMatter: frontMatter3
      }];
      "
    `)
  })
})
