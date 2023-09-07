import path from 'node:path'
import { describe } from 'vitest'
import { CWD } from '../src/constants'
import { toPageMap } from '../src/to-page-map'

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
      import {frontMatter as frontMatter11} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/arguments.md\\";
      import {frontMatter as frontMatter12} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/callout.mdx\\";
      import {frontMatter as frontMatter13} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/change-log.mdx\\";
      import {frontMatter as frontMatter14} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/code-block-without-language.mdx\\";
      import {frontMatter as frontMatter15} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/conditional-fetching.md\\";
      import {frontMatter as frontMatter16} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/custom-header-ids.mdx\\";
      import {frontMatter as frontMatter17} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/data-fetching.mdx\\";
      import {frontMatter as frontMatter18} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/error-handling.mdx\\";
      import {frontMatter as frontMatter19} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/getting-started.mdx\\";
      import {frontMatter as frontMatter20} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/global-configuration.md\\";
      import {frontMatter as frontMatter21} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/middleware.md\\";
      import {frontMatter as frontMatter22} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/mutation.md\\";
      import {frontMatter as frontMatter23} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/options.mdx\\";
      import {frontMatter as frontMatter24} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/pagination.mdx\\";
      import {frontMatter as frontMatter25} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/prefetching.md\\";
      import {frontMatter as frontMatter26} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/raw-layout.mdx\\";
      import {frontMatter as frontMatter27} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/revalidation.mdx\\";
      import {frontMatter as frontMatter28} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/suspense.mdx\\";
      import {frontMatter as frontMatter29} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/typescript.mdx\\";
      import {frontMatter as frontMatter30} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/understanding.mdx\\";
      import {frontMatter as frontMatter31} from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/with-nextjs.md\\";
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
        kind: \\"Meta\\",
        data: meta0
      }, {
        \\"kind\\": \\"Folder\\",
        \\"name\\": \\"about\\",
        \\"route\\": \\"/about\\",
        children: [{
          kind: \\"Meta\\",
          data: meta1
        }, {
          kind: \\"MdxPage\\",
          name: \\"a-page\\",
          route: \\"/about/a-page\\",
          frontMatter: frontMatter4
        }, {
          kind: \\"MdxPage\\",
          name: \\"acknowledgement\\",
          route: \\"/about/acknowledgement\\",
          frontMatter: frontMatter5
        }, {
          kind: \\"MdxPage\\",
          name: \\"changelog\\",
          route: \\"/about/changelog\\",
          frontMatter: frontMatter6
        }, {
          kind: \\"MdxPage\\",
          name: \\"team\\",
          route: \\"/about/team\\",
          frontMatter: frontMatter7
        }]
      }, {
        \\"kind\\": \\"Folder\\",
        \\"name\\": \\"blog\\",
        \\"route\\": \\"/blog\\",
        children: [{
          kind: \\"Meta\\",
          data: meta2
        }, {
          kind: \\"MdxPage\\",
          name: \\"swr-v1\\",
          route: \\"/blog/swr-v1\\",
          frontMatter: frontMatter8
        }]
      }, {
        kind: \\"MdxPage\\",
        name: \\"blog\\",
        route: \\"/blog\\",
        frontMatter: frontMatter0
      }, {
        \\"kind\\": \\"Folder\\",
        \\"name\\": \\"docs\\",
        \\"route\\": \\"/docs\\",
        children: [{
          kind: \\"MdxPage\\",
          name: \\"404-500\\",
          route: \\"/docs/404-500\\",
          frontMatter: frontMatter9
        }, {
          kind: \\"Meta\\",
          data: meta3
        }, {
          \\"kind\\": \\"Folder\\",
          \\"name\\": \\"advanced\\",
          \\"route\\": \\"/docs/advanced\\",
          children: [{
            kind: \\"Meta\\",
            data: meta5
          }, {
            kind: \\"MdxPage\\",
            name: \\"cache\\",
            route: \\"/docs/advanced/cache\\",
            frontMatter: frontMatter39
          }, {
            kind: \\"MdxPage\\",
            name: \\"code-highlighting\\",
            route: \\"/docs/advanced/code-highlighting\\",
            frontMatter: frontMatter40
          }, {
            kind: \\"MdxPage\\",
            name: \\"dynamic-markdown-import\\",
            route: \\"/docs/advanced/dynamic-markdown-import\\",
            frontMatter: frontMatter41
          }, {
            kind: \\"MdxPage\\",
            name: \\"file-name.with.DOTS\\",
            route: \\"/docs/advanced/file-name.with.DOTS\\",
            frontMatter: frontMatter42
          }, {
            kind: \\"MdxPage\\",
            name: \\"images\\",
            route: \\"/docs/advanced/images\\",
            frontMatter: frontMatter43
          }, {
            kind: \\"MdxPage\\",
            name: \\"markdown-import\\",
            route: \\"/docs/advanced/markdown-import\\",
            frontMatter: frontMatter44
          }, {
            \\"kind\\": \\"Folder\\",
            \\"name\\": \\"more\\",
            \\"route\\": \\"/docs/advanced/more\\",
            children: [{
              kind: \\"MdxPage\\",
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/docs/advanced/more/loooooooooooooooooooong-title\\",
              frontMatter: frontMatter48
            }, {
              \\"kind\\": \\"Folder\\",
              \\"name\\": \\"tree\\",
              \\"route\\": \\"/docs/advanced/more/tree\\",
              children: [{
                kind: \\"MdxPage\\",
                name: \\"one\\",
                route: \\"/docs/advanced/more/tree/one\\",
                frontMatter: frontMatter49
              }, {
                kind: \\"MdxPage\\",
                name: \\"three\\",
                route: \\"/docs/advanced/more/tree/three\\",
                frontMatter: frontMatter50
              }, {
                kind: \\"MdxPage\\",
                name: \\"two\\",
                route: \\"/docs/advanced/more/tree/two\\",
                frontMatter: frontMatter51
              }]
            }]
          }, {
            kind: \\"MdxPage\\",
            name: \\"performance\\",
            route: \\"/docs/advanced/performance\\",
            frontMatter: frontMatter45
          }, {
            kind: \\"MdxPage\\",
            name: \\"react-native\\",
            route: \\"/docs/advanced/react-native\\",
            frontMatter: frontMatter46
          }, {
            kind: \\"MdxPage\\",
            name: \\"scrollbar-x\\",
            route: \\"/docs/advanced/scrollbar-x\\",
            frontMatter: frontMatter47
          }]
        }, {
          kind: \\"MdxPage\\",
          name: \\"advanced\\",
          route: \\"/docs/advanced\\",
          frontMatter: frontMatter10
        }, {
          kind: \\"MdxPage\\",
          name: \\"arguments\\",
          route: \\"/docs/arguments\\",
          frontMatter: frontMatter11
        }, {
          kind: \\"MdxPage\\",
          name: \\"callout\\",
          route: \\"/docs/callout\\",
          frontMatter: frontMatter12
        }, {
          kind: \\"MdxPage\\",
          name: \\"change-log\\",
          route: \\"/docs/change-log\\",
          frontMatter: frontMatter13
        }, {
          kind: \\"MdxPage\\",
          name: \\"code-block-without-language\\",
          route: \\"/docs/code-block-without-language\\",
          frontMatter: frontMatter14
        }, {
          kind: \\"MdxPage\\",
          name: \\"conditional-fetching\\",
          route: \\"/docs/conditional-fetching\\",
          frontMatter: frontMatter15
        }, {
          kind: \\"MdxPage\\",
          name: \\"custom-header-ids\\",
          route: \\"/docs/custom-header-ids\\",
          frontMatter: frontMatter16
        }, {
          kind: \\"MdxPage\\",
          name: \\"data-fetching\\",
          route: \\"/docs/data-fetching\\",
          frontMatter: frontMatter17
        }, {
          kind: \\"MdxPage\\",
          name: \\"error-handling\\",
          route: \\"/docs/error-handling\\",
          frontMatter: frontMatter18
        }, {
          kind: \\"MdxPage\\",
          name: \\"getting-started\\",
          route: \\"/docs/getting-started\\",
          frontMatter: frontMatter19
        }, {
          kind: \\"MdxPage\\",
          name: \\"global-configuration\\",
          route: \\"/docs/global-configuration\\",
          frontMatter: frontMatter20
        }, {
          kind: \\"MdxPage\\",
          name: \\"middleware\\",
          route: \\"/docs/middleware\\",
          frontMatter: frontMatter21
        }, {
          kind: \\"MdxPage\\",
          name: \\"mutation\\",
          route: \\"/docs/mutation\\",
          frontMatter: frontMatter22
        }, {
          kind: \\"MdxPage\\",
          name: \\"options\\",
          route: \\"/docs/options\\",
          frontMatter: frontMatter23
        }, {
          kind: \\"MdxPage\\",
          name: \\"pagination\\",
          route: \\"/docs/pagination\\",
          frontMatter: frontMatter24
        }, {
          kind: \\"MdxPage\\",
          name: \\"prefetching\\",
          route: \\"/docs/prefetching\\",
          frontMatter: frontMatter25
        }, {
          kind: \\"MdxPage\\",
          name: \\"raw-layout\\",
          route: \\"/docs/raw-layout\\",
          frontMatter: frontMatter26
        }, {
          kind: \\"MdxPage\\",
          name: \\"revalidation\\",
          route: \\"/docs/revalidation\\",
          frontMatter: frontMatter27
        }, {
          kind: \\"MdxPage\\",
          name: \\"suspense\\",
          route: \\"/docs/suspense\\",
          frontMatter: frontMatter28
        }, {
          kind: \\"MdxPage\\",
          name: \\"typescript\\",
          route: \\"/docs/typescript\\",
          frontMatter: frontMatter29
        }, {
          kind: \\"MdxPage\\",
          name: \\"understanding\\",
          route: \\"/docs/understanding\\",
          frontMatter: frontMatter30
        }, {
          kind: \\"MdxPage\\",
          name: \\"with-nextjs\\",
          route: \\"/docs/with-nextjs\\",
          frontMatter: frontMatter31
        }, {
          kind: \\"MdxPage\\",
          name: \\"wrap-toc-items\\",
          route: \\"/docs/wrap-toc-items\\",
          frontMatter: frontMatter32
        }]
      }, {
        \\"kind\\": \\"Folder\\",
        \\"name\\": \\"examples\\",
        \\"route\\": \\"/examples\\",
        children: [{
          kind: \\"Meta\\",
          data: meta4
        }, {
          kind: \\"MdxPage\\",
          name: \\"auth\\",
          route: \\"/examples/auth\\",
          frontMatter: frontMatter33
        }, {
          kind: \\"MdxPage\\",
          name: \\"basic\\",
          route: \\"/examples/basic\\",
          frontMatter: frontMatter34
        }, {
          kind: \\"MdxPage\\",
          name: \\"error-handling\\",
          route: \\"/examples/error-handling\\",
          frontMatter: frontMatter35
        }, {
          kind: \\"MdxPage\\",
          name: \\"full\\",
          route: \\"/examples/full\\",
          frontMatter: frontMatter36
        }, {
          kind: \\"MdxPage\\",
          name: \\"infinite-loading\\",
          route: \\"/examples/infinite-loading\\",
          frontMatter: frontMatter37
        }, {
          kind: \\"MdxPage\\",
          name: \\"ssr\\",
          route: \\"/examples/ssr\\",
          frontMatter: frontMatter38
        }]
      }, {
        kind: \\"MdxPage\\",
        name: \\"foo\\",
        route: \\"/foo\\",
        frontMatter: frontMatter1
      }, {
        kind: \\"MdxPage\\",
        name: \\"index\\",
        route: \\"/\\",
        frontMatter: frontMatter2
      }, {
        kind: \\"MdxPage\\",
        name: \\"test\\",
        route: \\"/test\\",
        frontMatter: frontMatter3
      }];
      "
    `)
  })
})
