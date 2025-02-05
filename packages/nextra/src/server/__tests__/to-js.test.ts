import path from 'node:path'
import { CWD } from '../constants.js'
import { findMetaAndPageFilePaths } from '../page-map/find-meta-and-page-file-paths.js'
import { convertPageMapToJs } from '../page-map/to-js.js'
import { convertToPageMap } from '../page-map/to-page-map.js'

describe('convertPageMapToJs()', () => {
  it('should work for docs example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'docs')
    const filePaths = await findMetaAndPageFilePaths({
      dir: path.join(cwd, 'src/app'),
      cwd,
      contentDir: 'src/content'
    })
    const { pageMap, mdxPages } = convertToPageMap({ filePaths })

    const result = convertPageMapToJs({ pageMap, mdxPages })
    expect(result).toMatchInlineSnapshot(`
      "import { normalizePageMap, getMetadata } from 'nextra/page-map'

      import meta from "private-next-root-dir/src/content/_meta.js";
      import features_meta from "private-next-root-dir/src/content/features/_meta.js";
      import {metadata as features_i18n} from "private-next-root-dir/src/content/features/i18n.mdx?metadata";
      import {metadata as features_image} from "private-next-root-dir/src/content/features/image.mdx?metadata";
      import {metadata as features_latex} from "private-next-root-dir/src/content/features/latex.mdx?metadata";
      import {metadata as features_mdx} from "private-next-root-dir/src/content/features/mdx.mdx?metadata";
      import {metadata as features_ssg} from "private-next-root-dir/src/content/features/ssg.mdx?metadata";
      import {metadata as features_themes} from "private-next-root-dir/src/content/features/themes.mdx?metadata";
      import themes_meta from "private-next-root-dir/src/content/themes/_meta.js";
      import themes_blog_meta from "private-next-root-dir/src/content/themes/blog/_meta.js";
      import {metadata as themes_blog_index} from "private-next-root-dir/src/content/themes/blog/index.mdx?metadata";
      import themes_docs_meta from "private-next-root-dir/src/content/themes/docs/_meta.js";
      import {metadata as themes_docs_bleed} from "private-next-root-dir/src/content/themes/docs/bleed.mdx?metadata";
      import {metadata as themes_docs_callout} from "private-next-root-dir/src/content/themes/docs/callout.mdx?metadata";
      import {metadata as themes_docs_configuration} from "private-next-root-dir/src/content/themes/docs/configuration.mdx?metadata";
      import {metadata as themes_docs_index} from "private-next-root-dir/src/content/themes/docs/index.mdx?metadata";
      import {metadata as themes_docs_tabs} from "private-next-root-dir/src/content/themes/docs/tabs.mdx?metadata";
      import * as src_app_blog_page from "private-next-root-dir/src/app/blog/page.jsx";
      import {metadata as index} from "private-next-root-dir/src/content/index.mdx?metadata";
      import * as src_app_showcase_overview_page from "private-next-root-dir/src/app/showcase/(overview)/page.jsx";
      import {metadata as advanced_code_highlighting} from "private-next-root-dir/src/content/advanced/code-highlighting.mdx?metadata";
      import {metadata as get_started} from "private-next-root-dir/src/content/get-started.mdx?metadata";
      import {metadata as mermaid} from "private-next-root-dir/src/content/mermaid.mdx?metadata";
      import {metadata as page} from "private-next-root-dir/src/content/page.mdx?metadata";

      export const pageMap = normalizePageMap([{
        data: meta
      }, {
        name: "features",
        route: "/features",
        children: [{
          data: features_meta
        }, {
          name: "i18n",
          route: "/features/i18n",
          frontMatter: features_i18n
        }, {
          name: "image",
          route: "/features/image",
          frontMatter: features_image
        }, {
          name: "latex",
          route: "/features/latex",
          frontMatter: features_latex
        }, {
          name: "mdx",
          route: "/features/mdx",
          frontMatter: features_mdx
        }, {
          name: "ssg",
          route: "/features/ssg",
          frontMatter: features_ssg
        }, {
          name: "themes",
          route: "/features/themes",
          frontMatter: features_themes
        }]
      }, {
        name: "themes",
        route: "/themes",
        children: [{
          data: themes_meta
        }, {
          name: "blog",
          route: "/themes/blog",
          children: [{
            data: themes_blog_meta
          }, {
            name: "index",
            route: "/themes/blog",
            frontMatter: themes_blog_index
          }]
        }, {
          name: "docs",
          route: "/themes/docs",
          children: [{
            data: themes_docs_meta
          }, {
            name: "bleed",
            route: "/themes/docs/bleed",
            frontMatter: themes_docs_bleed
          }, {
            name: "callout",
            route: "/themes/docs/callout",
            frontMatter: themes_docs_callout
          }, {
            name: "configuration",
            route: "/themes/docs/configuration",
            frontMatter: themes_docs_configuration
          }, {
            name: "index",
            route: "/themes/docs",
            frontMatter: themes_docs_index
          }, {
            name: "tabs",
            route: "/themes/docs/tabs",
            frontMatter: themes_docs_tabs
          }]
        }]
      }, {
        name: "blog",
        route: "/blog",
        frontMatter: getMetadata(src_app_blog_page)
      }, {
        name: "index",
        route: "/",
        frontMatter: index
      }, {
        name: "showcase",
        route: "/showcase",
        frontMatter: getMetadata(src_app_showcase_overview_page)
      }, {
        name: "advanced",
        route: "/advanced",
        children: [{
          name: "code-highlighting",
          route: "/advanced/code-highlighting",
          frontMatter: advanced_code_highlighting
        }]
      }, {
        name: "get-started",
        route: "/get-started",
        frontMatter: get_started
      }, {
        name: "mermaid",
        route: "/mermaid",
        frontMatter: mermaid
      }, {
        name: "page",
        route: "/page",
        frontMatter: page
      }])

      export const RouteToFilepath = {
        "": "index.mdx",
        "advanced/code-highlighting": "advanced/code-highlighting.mdx",
        "features/i18n": "features/i18n.mdx",
        "features/image": "features/image.mdx",
        "features/latex": "features/latex.mdx",
        "features/mdx": "features/mdx.mdx",
        "features/ssg": "features/ssg.mdx",
        "features/themes": "features/themes.mdx",
        "get-started": "get-started.mdx",
        "mermaid": "mermaid.mdx",
        "page": "page.mdx",
        "themes/blog": "themes/blog/index.mdx",
        "themes/docs/bleed": "themes/docs/bleed.mdx",
        "themes/docs/callout": "themes/docs/callout.mdx",
        "themes/docs/configuration": "themes/docs/configuration.mdx",
        "themes/docs": "themes/docs/index.mdx",
        "themes/docs/tabs": "themes/docs/tabs.mdx"
      }"
    `)
  })
})
