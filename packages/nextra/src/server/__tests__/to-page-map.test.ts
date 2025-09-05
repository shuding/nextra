import path from 'node:path'
import { CWD } from '../constants.js'
import { findMetaAndPageFilePaths } from '../page-map/find-meta-and-page-file-paths.js'
import { convertPageMapToJs } from '../page-map/to-js.js'
import { convertToPageMap } from '../page-map/to-page-map.js'

describe('generatePageMap()', () => {
  it('should work for blog example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'blog')
    const filePaths = await findMetaAndPageFilePaths({
      dir: path.join(cwd, 'app'),
      cwd
    })
    const { pageMap } = convertToPageMap({ filePaths })
    expect(filePaths).toMatchInlineSnapshot(`
      [
        "app/_meta.global.js",
        "app/page.mdx",
        "app/posts/(with-comments)/aaron-swartz-a-programmable-web/page.mdx",
        "app/posts/(with-comments)/code-blocks/page.mdx",
        "app/posts/(with-comments)/draft/page.mdx",
        "app/posts/(with-comments)/lists/page.mdx",
        "app/posts/(with-comments)/nextra-components/page.mdx",
        "app/posts/(with-comments)/table/page.mdx",
        "app/posts/page.jsx",
      ]
    `)
    expect(pageMap).toMatchInlineSnapshot(`
      [
        {
          "__pagePath": "app/page.mdx",
          "name": "index",
          "route": "/",
        },
        {
          "children": [
            {
              "__pagePath": "app/posts/(with-comments)/aaron-swartz-a-programmable-web/page.mdx",
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
            {
              "__pagePath": "app/posts/(with-comments)/code-blocks/page.mdx",
              "name": "code-blocks",
              "route": "/posts/code-blocks",
            },
            {
              "__pagePath": "app/posts/(with-comments)/draft/page.mdx",
              "name": "draft",
              "route": "/posts/draft",
            },
            {
              "__pagePath": "app/posts/(with-comments)/lists/page.mdx",
              "name": "lists",
              "route": "/posts/lists",
            },
            {
              "__pagePath": "app/posts/(with-comments)/nextra-components/page.mdx",
              "name": "nextra-components",
              "route": "/posts/nextra-components",
            },
            {
              "__pagePath": "app/posts/(with-comments)/table/page.mdx",
              "name": "table",
              "route": "/posts/table",
            },
            {
              "__pagePath": "app/posts/page.jsx",
              "name": "index",
              "route": "/posts",
            },
          ],
          "name": "posts",
          "route": "/posts",
        },
      ]
    `)
  })

  it('should work for nextra.site', async () => {
    const cwd = path.join(CWD, '..', '..', 'docs')
    const filePaths = await findMetaAndPageFilePaths({
      dir: path.join(cwd, 'app'),
      cwd
    })
    const { pageMap, mdxPages } = convertToPageMap({ filePaths })
    expect(filePaths).toMatchInlineSnapshot(`
      [
        "app/_meta.global.tsx",
        "app/about/page.mdx",
        "app/api/page.mdx",
        "app/blog/page.mdx",
        "app/docs/advanced/customize-the-cascade-layers/page.mdx",
        "app/docs/advanced/latex/page.mdx",
        "app/docs/advanced/mermaid/page.mdx",
        "app/docs/advanced/npm2yarn/page.mdx",
        "app/docs/advanced/page.mdx",
        "app/docs/advanced/remote/page.mdx",
        "app/docs/advanced/table/page.mdx",
        "app/docs/advanced/tailwind-css/page.mdx",
        "app/docs/advanced/twoslash/page.mdx",
        "app/docs/advanced/typescript/page.mdx",
        "app/docs/blog-theme/get-posts-and-tags/page.mdx",
        "app/docs/blog-theme/page.mdx",
        "app/docs/blog-theme/posts/page.mdx",
        "app/docs/blog-theme/rss/page.mdx",
        "app/docs/blog-theme/start/page.mdx",
        "app/docs/blog-theme/tags/page.mdx",
        "app/docs/built-ins/page.mdx",
        "app/docs/custom-theme/page.mdx",
        "app/docs/docs-theme/api/page.mdx",
        "app/docs/docs-theme/built-ins/footer/page.mdx",
        "app/docs/docs-theme/built-ins/layout/page.mdx",
        "app/docs/docs-theme/built-ins/navbar/page.mdx",
        "app/docs/docs-theme/built-ins/not-found/page.mdx",
        "app/docs/docs-theme/built-ins/page.mdx",
        "app/docs/docs-theme/page.mdx",
        "app/docs/docs-theme/start/page.mdx",
        "app/docs/file-conventions/content-directory/page.mdx",
        "app/docs/file-conventions/mdx-components-file/page.mdx",
        "app/docs/file-conventions/meta-file/page.mdx",
        "app/docs/file-conventions/page-file/page.mdx",
        "app/docs/file-conventions/page.mdx",
        "app/docs/file-conventions/src-directory/page.mdx",
        "app/docs/guide/custom-css/page.mdx",
        "app/docs/guide/github-alert-syntax/page.mdx",
        "app/docs/guide/i18n/page.mdx",
        "app/docs/guide/image/page.mdx",
        "app/docs/guide/link/page.mdx",
        "app/docs/guide/markdown/page.mdx",
        "app/docs/guide/page.mdx",
        "app/docs/guide/search/page.mdx",
        "app/docs/guide/ssg/page.mdx",
        "app/docs/guide/static-exports/page.mdx",
        "app/docs/guide/syntax-highlighting/page.mdx",
        "app/docs/guide/turbopack/page.mdx",
        "app/docs/page.mdx",
        "app/page.tsx",
        "app/showcase/page.mdx",
        "app/sponsors/page.mdx",
      ]
    `)
    expect(pageMap).toMatchInlineSnapshot(`
      [
        {
          "__pagePath": "app/about/page.mdx",
          "name": "about",
          "route": "/about",
        },
        {
          "__pagePath": "app/api/page.mdx",
          "name": "api",
          "route": "/api",
        },
        {
          "__pagePath": "app/blog/page.mdx",
          "name": "blog",
          "route": "/blog",
        },
        {
          "children": [
            {
              "children": [
                {
                  "__pagePath": "app/docs/advanced/customize-the-cascade-layers/page.mdx",
                  "name": "customize-the-cascade-layers",
                  "route": "/docs/advanced/customize-the-cascade-layers",
                },
                {
                  "__pagePath": "app/docs/advanced/latex/page.mdx",
                  "name": "latex",
                  "route": "/docs/advanced/latex",
                },
                {
                  "__pagePath": "app/docs/advanced/mermaid/page.mdx",
                  "name": "mermaid",
                  "route": "/docs/advanced/mermaid",
                },
                {
                  "__pagePath": "app/docs/advanced/npm2yarn/page.mdx",
                  "name": "npm2yarn",
                  "route": "/docs/advanced/npm2yarn",
                },
                {
                  "__pagePath": "app/docs/advanced/page.mdx",
                  "name": "index",
                  "route": "/docs/advanced",
                },
                {
                  "__pagePath": "app/docs/advanced/remote/page.mdx",
                  "name": "remote",
                  "route": "/docs/advanced/remote",
                },
                {
                  "__pagePath": "app/docs/advanced/table/page.mdx",
                  "name": "table",
                  "route": "/docs/advanced/table",
                },
                {
                  "__pagePath": "app/docs/advanced/tailwind-css/page.mdx",
                  "name": "tailwind-css",
                  "route": "/docs/advanced/tailwind-css",
                },
                {
                  "__pagePath": "app/docs/advanced/twoslash/page.mdx",
                  "name": "twoslash",
                  "route": "/docs/advanced/twoslash",
                },
                {
                  "__pagePath": "app/docs/advanced/typescript/page.mdx",
                  "name": "typescript",
                  "route": "/docs/advanced/typescript",
                },
              ],
              "name": "advanced",
              "route": "/docs/advanced",
            },
            {
              "children": [
                {
                  "__pagePath": "app/docs/blog-theme/get-posts-and-tags/page.mdx",
                  "name": "get-posts-and-tags",
                  "route": "/docs/blog-theme/get-posts-and-tags",
                },
                {
                  "__pagePath": "app/docs/blog-theme/page.mdx",
                  "name": "index",
                  "route": "/docs/blog-theme",
                },
                {
                  "__pagePath": "app/docs/blog-theme/posts/page.mdx",
                  "name": "posts",
                  "route": "/docs/blog-theme/posts",
                },
                {
                  "__pagePath": "app/docs/blog-theme/rss/page.mdx",
                  "name": "rss",
                  "route": "/docs/blog-theme/rss",
                },
                {
                  "__pagePath": "app/docs/blog-theme/start/page.mdx",
                  "name": "start",
                  "route": "/docs/blog-theme/start",
                },
                {
                  "__pagePath": "app/docs/blog-theme/tags/page.mdx",
                  "name": "tags",
                  "route": "/docs/blog-theme/tags",
                },
              ],
              "name": "blog-theme",
              "route": "/docs/blog-theme",
            },
            {
              "__pagePath": "app/docs/built-ins/page.mdx",
              "name": "built-ins",
              "route": "/docs/built-ins",
            },
            {
              "__pagePath": "app/docs/custom-theme/page.mdx",
              "name": "custom-theme",
              "route": "/docs/custom-theme",
            },
            {
              "children": [
                {
                  "__pagePath": "app/docs/docs-theme/api/page.mdx",
                  "name": "api",
                  "route": "/docs/docs-theme/api",
                },
                {
                  "children": [
                    {
                      "__pagePath": "app/docs/docs-theme/built-ins/footer/page.mdx",
                      "name": "footer",
                      "route": "/docs/docs-theme/built-ins/footer",
                    },
                    {
                      "__pagePath": "app/docs/docs-theme/built-ins/layout/page.mdx",
                      "name": "layout",
                      "route": "/docs/docs-theme/built-ins/layout",
                    },
                    {
                      "__pagePath": "app/docs/docs-theme/built-ins/navbar/page.mdx",
                      "name": "navbar",
                      "route": "/docs/docs-theme/built-ins/navbar",
                    },
                    {
                      "__pagePath": "app/docs/docs-theme/built-ins/not-found/page.mdx",
                      "name": "not-found",
                      "route": "/docs/docs-theme/built-ins/not-found",
                    },
                    {
                      "__pagePath": "app/docs/docs-theme/built-ins/page.mdx",
                      "name": "index",
                      "route": "/docs/docs-theme/built-ins",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/docs-theme/built-ins",
                },
                {
                  "__pagePath": "app/docs/docs-theme/page.mdx",
                  "name": "index",
                  "route": "/docs/docs-theme",
                },
                {
                  "__pagePath": "app/docs/docs-theme/start/page.mdx",
                  "name": "start",
                  "route": "/docs/docs-theme/start",
                },
              ],
              "name": "docs-theme",
              "route": "/docs/docs-theme",
            },
            {
              "children": [
                {
                  "__pagePath": "app/docs/file-conventions/content-directory/page.mdx",
                  "name": "content-directory",
                  "route": "/docs/file-conventions/content-directory",
                },
                {
                  "__pagePath": "app/docs/file-conventions/mdx-components-file/page.mdx",
                  "name": "mdx-components-file",
                  "route": "/docs/file-conventions/mdx-components-file",
                },
                {
                  "__pagePath": "app/docs/file-conventions/meta-file/page.mdx",
                  "name": "meta-file",
                  "route": "/docs/file-conventions/meta-file",
                },
                {
                  "__pagePath": "app/docs/file-conventions/page-file/page.mdx",
                  "name": "page-file",
                  "route": "/docs/file-conventions/page-file",
                },
                {
                  "__pagePath": "app/docs/file-conventions/page.mdx",
                  "name": "index",
                  "route": "/docs/file-conventions",
                },
                {
                  "__pagePath": "app/docs/file-conventions/src-directory/page.mdx",
                  "name": "src-directory",
                  "route": "/docs/file-conventions/src-directory",
                },
              ],
              "name": "file-conventions",
              "route": "/docs/file-conventions",
            },
            {
              "children": [
                {
                  "__pagePath": "app/docs/guide/custom-css/page.mdx",
                  "name": "custom-css",
                  "route": "/docs/guide/custom-css",
                },
                {
                  "__pagePath": "app/docs/guide/github-alert-syntax/page.mdx",
                  "name": "github-alert-syntax",
                  "route": "/docs/guide/github-alert-syntax",
                },
                {
                  "__pagePath": "app/docs/guide/i18n/page.mdx",
                  "name": "i18n",
                  "route": "/docs/guide/i18n",
                },
                {
                  "__pagePath": "app/docs/guide/image/page.mdx",
                  "name": "image",
                  "route": "/docs/guide/image",
                },
                {
                  "__pagePath": "app/docs/guide/link/page.mdx",
                  "name": "link",
                  "route": "/docs/guide/link",
                },
                {
                  "__pagePath": "app/docs/guide/markdown/page.mdx",
                  "name": "markdown",
                  "route": "/docs/guide/markdown",
                },
                {
                  "__pagePath": "app/docs/guide/page.mdx",
                  "name": "index",
                  "route": "/docs/guide",
                },
                {
                  "__pagePath": "app/docs/guide/search/page.mdx",
                  "name": "search",
                  "route": "/docs/guide/search",
                },
                {
                  "__pagePath": "app/docs/guide/ssg/page.mdx",
                  "name": "ssg",
                  "route": "/docs/guide/ssg",
                },
                {
                  "__pagePath": "app/docs/guide/static-exports/page.mdx",
                  "name": "static-exports",
                  "route": "/docs/guide/static-exports",
                },
                {
                  "__pagePath": "app/docs/guide/syntax-highlighting/page.mdx",
                  "name": "syntax-highlighting",
                  "route": "/docs/guide/syntax-highlighting",
                },
                {
                  "__pagePath": "app/docs/guide/turbopack/page.mdx",
                  "name": "turbopack",
                  "route": "/docs/guide/turbopack",
                },
              ],
              "name": "guide",
              "route": "/docs/guide",
            },
            {
              "__pagePath": "app/docs/page.mdx",
              "name": "index",
              "route": "/docs",
            },
          ],
          "name": "docs",
          "route": "/docs",
        },
        {
          "__pagePath": "app/page.tsx",
          "name": "index",
          "route": "/",
        },
        {
          "__pagePath": "app/showcase/page.mdx",
          "name": "showcase",
          "route": "/showcase",
        },
        {
          "__pagePath": "app/sponsors/page.mdx",
          "name": "sponsors",
          "route": "/sponsors",
        },
      ]
    `)

    const globalMetaPath = filePaths.find(filePath =>
      filePath.includes('/_meta.global.')
    )

    expect(convertPageMapToJs({ pageMap, mdxPages, globalMetaPath }))
      .toMatchInlineSnapshot(`
        "import { normalizePageMap, mergeMetaWithPageMap, getMetadata } from 'nextra/page-map'
        import globalMeta from 'private-next-root-dir/app/_meta.global.tsx'
        import {metadata as app_about_page} from "private-next-root-dir/app/about/page.mdx?metadata";
        import {metadata as app_api_page} from "private-next-root-dir/app/api/page.mdx?metadata";
        import {metadata as app_blog_page} from "private-next-root-dir/app/blog/page.mdx?metadata";
        import {metadata as app_docs_advanced_customize_the_cascade_layers_page} from "private-next-root-dir/app/docs/advanced/customize-the-cascade-layers/page.mdx?metadata";
        import {metadata as app_docs_advanced_latex_page} from "private-next-root-dir/app/docs/advanced/latex/page.mdx?metadata";
        import {metadata as app_docs_advanced_mermaid_page} from "private-next-root-dir/app/docs/advanced/mermaid/page.mdx?metadata";
        import {metadata as app_docs_advanced_npm2yarn_page} from "private-next-root-dir/app/docs/advanced/npm2yarn/page.mdx?metadata";
        import {metadata as app_docs_advanced_page} from "private-next-root-dir/app/docs/advanced/page.mdx?metadata";
        import {metadata as app_docs_advanced_remote_page} from "private-next-root-dir/app/docs/advanced/remote/page.mdx?metadata";
        import {metadata as app_docs_advanced_table_page} from "private-next-root-dir/app/docs/advanced/table/page.mdx?metadata";
        import {metadata as app_docs_advanced_tailwind_css_page} from "private-next-root-dir/app/docs/advanced/tailwind-css/page.mdx?metadata";
        import {metadata as app_docs_advanced_twoslash_page} from "private-next-root-dir/app/docs/advanced/twoslash/page.mdx?metadata";
        import {metadata as app_docs_advanced_typescript_page} from "private-next-root-dir/app/docs/advanced/typescript/page.mdx?metadata";
        import {metadata as app_docs_blog_theme_get_posts_and_tags_page} from "private-next-root-dir/app/docs/blog-theme/get-posts-and-tags/page.mdx?metadata";
        import {metadata as app_docs_blog_theme_page} from "private-next-root-dir/app/docs/blog-theme/page.mdx?metadata";
        import {metadata as app_docs_blog_theme_posts_page} from "private-next-root-dir/app/docs/blog-theme/posts/page.mdx?metadata";
        import {metadata as app_docs_blog_theme_rss_page} from "private-next-root-dir/app/docs/blog-theme/rss/page.mdx?metadata";
        import {metadata as app_docs_blog_theme_start_page} from "private-next-root-dir/app/docs/blog-theme/start/page.mdx?metadata";
        import {metadata as app_docs_blog_theme_tags_page} from "private-next-root-dir/app/docs/blog-theme/tags/page.mdx?metadata";
        import {metadata as app_docs_built_ins_page} from "private-next-root-dir/app/docs/built-ins/page.mdx?metadata";
        import {metadata as app_docs_custom_theme_page} from "private-next-root-dir/app/docs/custom-theme/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_api_page} from "private-next-root-dir/app/docs/docs-theme/api/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_built_ins_footer_page} from "private-next-root-dir/app/docs/docs-theme/built-ins/footer/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_built_ins_layout_page} from "private-next-root-dir/app/docs/docs-theme/built-ins/layout/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_built_ins_navbar_page} from "private-next-root-dir/app/docs/docs-theme/built-ins/navbar/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_built_ins_not_found_page} from "private-next-root-dir/app/docs/docs-theme/built-ins/not-found/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_built_ins_page} from "private-next-root-dir/app/docs/docs-theme/built-ins/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_page} from "private-next-root-dir/app/docs/docs-theme/page.mdx?metadata";
        import {metadata as app_docs_docs_theme_start_page} from "private-next-root-dir/app/docs/docs-theme/start/page.mdx?metadata";
        import {metadata as app_docs_file_conventions_content_directory_page} from "private-next-root-dir/app/docs/file-conventions/content-directory/page.mdx?metadata";
        import {metadata as app_docs_file_conventions_mdx_components_file_page} from "private-next-root-dir/app/docs/file-conventions/mdx-components-file/page.mdx?metadata";
        import {metadata as app_docs_file_conventions_meta_file_page} from "private-next-root-dir/app/docs/file-conventions/meta-file/page.mdx?metadata";
        import {metadata as app_docs_file_conventions_page_file_page} from "private-next-root-dir/app/docs/file-conventions/page-file/page.mdx?metadata";
        import {metadata as app_docs_file_conventions_page} from "private-next-root-dir/app/docs/file-conventions/page.mdx?metadata";
        import {metadata as app_docs_file_conventions_src_directory_page} from "private-next-root-dir/app/docs/file-conventions/src-directory/page.mdx?metadata";
        import {metadata as app_docs_guide_custom_css_page} from "private-next-root-dir/app/docs/guide/custom-css/page.mdx?metadata";
        import {metadata as app_docs_guide_github_alert_syntax_page} from "private-next-root-dir/app/docs/guide/github-alert-syntax/page.mdx?metadata";
        import {metadata as app_docs_guide_i18n_page} from "private-next-root-dir/app/docs/guide/i18n/page.mdx?metadata";
        import {metadata as app_docs_guide_image_page} from "private-next-root-dir/app/docs/guide/image/page.mdx?metadata";
        import {metadata as app_docs_guide_link_page} from "private-next-root-dir/app/docs/guide/link/page.mdx?metadata";
        import {metadata as app_docs_guide_markdown_page} from "private-next-root-dir/app/docs/guide/markdown/page.mdx?metadata";
        import {metadata as app_docs_guide_page} from "private-next-root-dir/app/docs/guide/page.mdx?metadata";
        import {metadata as app_docs_guide_search_page} from "private-next-root-dir/app/docs/guide/search/page.mdx?metadata";
        import {metadata as app_docs_guide_ssg_page} from "private-next-root-dir/app/docs/guide/ssg/page.mdx?metadata";
        import {metadata as app_docs_guide_static_exports_page} from "private-next-root-dir/app/docs/guide/static-exports/page.mdx?metadata";
        import {metadata as app_docs_guide_syntax_highlighting_page} from "private-next-root-dir/app/docs/guide/syntax-highlighting/page.mdx?metadata";
        import {metadata as app_docs_guide_turbopack_page} from "private-next-root-dir/app/docs/guide/turbopack/page.mdx?metadata";
        import {metadata as app_docs_page} from "private-next-root-dir/app/docs/page.mdx?metadata";
        import * as app_page from "private-next-root-dir/app/page.tsx";
        import {metadata as app_showcase_page} from "private-next-root-dir/app/showcase/page.mdx?metadata";
        import {metadata as app_sponsors_page} from "private-next-root-dir/app/sponsors/page.mdx?metadata";

        export const pageMap = normalizePageMap(mergeMetaWithPageMap([{
          name: "about",
          route: "/about",
          frontMatter: app_about_page
        }, {
          name: "api",
          route: "/api",
          frontMatter: app_api_page
        }, {
          name: "blog",
          route: "/blog",
          frontMatter: app_blog_page
        }, {
          name: "docs",
          route: "/docs",
          children: [{
            name: "advanced",
            route: "/docs/advanced",
            children: [{
              name: "customize-the-cascade-layers",
              route: "/docs/advanced/customize-the-cascade-layers",
              frontMatter: app_docs_advanced_customize_the_cascade_layers_page
            }, {
              name: "latex",
              route: "/docs/advanced/latex",
              frontMatter: app_docs_advanced_latex_page
            }, {
              name: "mermaid",
              route: "/docs/advanced/mermaid",
              frontMatter: app_docs_advanced_mermaid_page
            }, {
              name: "npm2yarn",
              route: "/docs/advanced/npm2yarn",
              frontMatter: app_docs_advanced_npm2yarn_page
            }, {
              name: "index",
              route: "/docs/advanced",
              frontMatter: app_docs_advanced_page
            }, {
              name: "remote",
              route: "/docs/advanced/remote",
              frontMatter: app_docs_advanced_remote_page
            }, {
              name: "table",
              route: "/docs/advanced/table",
              frontMatter: app_docs_advanced_table_page
            }, {
              name: "tailwind-css",
              route: "/docs/advanced/tailwind-css",
              frontMatter: app_docs_advanced_tailwind_css_page
            }, {
              name: "twoslash",
              route: "/docs/advanced/twoslash",
              frontMatter: app_docs_advanced_twoslash_page
            }, {
              name: "typescript",
              route: "/docs/advanced/typescript",
              frontMatter: app_docs_advanced_typescript_page
            }]
          }, {
            name: "blog-theme",
            route: "/docs/blog-theme",
            children: [{
              name: "get-posts-and-tags",
              route: "/docs/blog-theme/get-posts-and-tags",
              frontMatter: app_docs_blog_theme_get_posts_and_tags_page
            }, {
              name: "index",
              route: "/docs/blog-theme",
              frontMatter: app_docs_blog_theme_page
            }, {
              name: "posts",
              route: "/docs/blog-theme/posts",
              frontMatter: app_docs_blog_theme_posts_page
            }, {
              name: "rss",
              route: "/docs/blog-theme/rss",
              frontMatter: app_docs_blog_theme_rss_page
            }, {
              name: "start",
              route: "/docs/blog-theme/start",
              frontMatter: app_docs_blog_theme_start_page
            }, {
              name: "tags",
              route: "/docs/blog-theme/tags",
              frontMatter: app_docs_blog_theme_tags_page
            }]
          }, {
            name: "built-ins",
            route: "/docs/built-ins",
            frontMatter: app_docs_built_ins_page
          }, {
            name: "custom-theme",
            route: "/docs/custom-theme",
            frontMatter: app_docs_custom_theme_page
          }, {
            name: "docs-theme",
            route: "/docs/docs-theme",
            children: [{
              name: "api",
              route: "/docs/docs-theme/api",
              frontMatter: app_docs_docs_theme_api_page
            }, {
              name: "built-ins",
              route: "/docs/docs-theme/built-ins",
              children: [{
                name: "footer",
                route: "/docs/docs-theme/built-ins/footer",
                frontMatter: app_docs_docs_theme_built_ins_footer_page
              }, {
                name: "layout",
                route: "/docs/docs-theme/built-ins/layout",
                frontMatter: app_docs_docs_theme_built_ins_layout_page
              }, {
                name: "navbar",
                route: "/docs/docs-theme/built-ins/navbar",
                frontMatter: app_docs_docs_theme_built_ins_navbar_page
              }, {
                name: "not-found",
                route: "/docs/docs-theme/built-ins/not-found",
                frontMatter: app_docs_docs_theme_built_ins_not_found_page
              }, {
                name: "index",
                route: "/docs/docs-theme/built-ins",
                frontMatter: app_docs_docs_theme_built_ins_page
              }]
            }, {
              name: "index",
              route: "/docs/docs-theme",
              frontMatter: app_docs_docs_theme_page
            }, {
              name: "start",
              route: "/docs/docs-theme/start",
              frontMatter: app_docs_docs_theme_start_page
            }]
          }, {
            name: "file-conventions",
            route: "/docs/file-conventions",
            children: [{
              name: "content-directory",
              route: "/docs/file-conventions/content-directory",
              frontMatter: app_docs_file_conventions_content_directory_page
            }, {
              name: "mdx-components-file",
              route: "/docs/file-conventions/mdx-components-file",
              frontMatter: app_docs_file_conventions_mdx_components_file_page
            }, {
              name: "meta-file",
              route: "/docs/file-conventions/meta-file",
              frontMatter: app_docs_file_conventions_meta_file_page
            }, {
              name: "page-file",
              route: "/docs/file-conventions/page-file",
              frontMatter: app_docs_file_conventions_page_file_page
            }, {
              name: "index",
              route: "/docs/file-conventions",
              frontMatter: app_docs_file_conventions_page
            }, {
              name: "src-directory",
              route: "/docs/file-conventions/src-directory",
              frontMatter: app_docs_file_conventions_src_directory_page
            }]
          }, {
            name: "guide",
            route: "/docs/guide",
            children: [{
              name: "custom-css",
              route: "/docs/guide/custom-css",
              frontMatter: app_docs_guide_custom_css_page
            }, {
              name: "github-alert-syntax",
              route: "/docs/guide/github-alert-syntax",
              frontMatter: app_docs_guide_github_alert_syntax_page
            }, {
              name: "i18n",
              route: "/docs/guide/i18n",
              frontMatter: app_docs_guide_i18n_page
            }, {
              name: "image",
              route: "/docs/guide/image",
              frontMatter: app_docs_guide_image_page
            }, {
              name: "link",
              route: "/docs/guide/link",
              frontMatter: app_docs_guide_link_page
            }, {
              name: "markdown",
              route: "/docs/guide/markdown",
              frontMatter: app_docs_guide_markdown_page
            }, {
              name: "index",
              route: "/docs/guide",
              frontMatter: app_docs_guide_page
            }, {
              name: "search",
              route: "/docs/guide/search",
              frontMatter: app_docs_guide_search_page
            }, {
              name: "ssg",
              route: "/docs/guide/ssg",
              frontMatter: app_docs_guide_ssg_page
            }, {
              name: "static-exports",
              route: "/docs/guide/static-exports",
              frontMatter: app_docs_guide_static_exports_page
            }, {
              name: "syntax-highlighting",
              route: "/docs/guide/syntax-highlighting",
              frontMatter: app_docs_guide_syntax_highlighting_page
            }, {
              name: "turbopack",
              route: "/docs/guide/turbopack",
              frontMatter: app_docs_guide_turbopack_page
            }]
          }, {
            name: "index",
            route: "/docs",
            frontMatter: app_docs_page
          }]
        }, {
          name: "index",
          route: "/",
          frontMatter: getMetadata(app_page)
        }, {
          name: "showcase",
          route: "/showcase",
          frontMatter: app_showcase_page
        }, {
          name: "sponsors",
          route: "/sponsors",
          frontMatter: app_sponsors_page
        }], globalMeta, true))

        export const RouteToFilepath = {}"
      `)
  })

  describe('should work for docs example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'docs')
    const filePaths = await findMetaAndPageFilePaths({
      dir: path.join(cwd, 'src/app'),
      cwd,
      contentDir: 'src/content'
    })
    it('should match filepaths', () => {
      expect(filePaths).toMatchInlineSnapshot(`
        [
          "src/app/_meta.js",
          "src/app/blog/page.jsx",
          "src/app/page.jsx",
          "src/app/showcase/(overview)/page.jsx",
          "src/content/_meta.js",
          "src/content/advanced/code-highlighting.mdx",
          "src/content/features/_meta.js",
          "src/content/features/i18n.mdx",
          "src/content/features/image.mdx",
          "src/content/features/latex.mdx",
          "src/content/features/mdx.mdx",
          "src/content/features/ssg.mdx",
          "src/content/features/themes.mdx",
          "src/content/get-started.mdx",
          "src/content/index.mdx",
          "src/content/mermaid.mdx",
          "src/content/page.mdx",
          "src/content/themes/_meta.js",
          "src/content/themes/blog/_meta.js",
          "src/content/themes/blog/index.mdx",
          "src/content/themes/docs/_meta.js",
          "src/content/themes/docs/bleed.mdx",
          "src/content/themes/docs/callout.mdx",
          "src/content/themes/docs/configuration.mdx",
          "src/content/themes/docs/index.mdx",
          "src/content/themes/docs/tabs.mdx",
        ]
      `)
    })
    it('should match page map', () => {
      const { pageMap } = convertToPageMap({ filePaths })
      expect(pageMap).toMatchInlineSnapshot(`
        [
          {
            "__metaPath": "src/content/_meta.js",
          },
          {
            "children": [
              {
                "__metaPath": "src/content/features/_meta.js",
              },
              {
                "__pagePath": "src/content/features/i18n.mdx",
                "name": "i18n",
                "route": "/features/i18n",
              },
              {
                "__pagePath": "src/content/features/image.mdx",
                "name": "image",
                "route": "/features/image",
              },
              {
                "__pagePath": "src/content/features/latex.mdx",
                "name": "latex",
                "route": "/features/latex",
              },
              {
                "__pagePath": "src/content/features/mdx.mdx",
                "name": "mdx",
                "route": "/features/mdx",
              },
              {
                "__pagePath": "src/content/features/ssg.mdx",
                "name": "ssg",
                "route": "/features/ssg",
              },
              {
                "__pagePath": "src/content/features/themes.mdx",
                "name": "themes",
                "route": "/features/themes",
              },
            ],
            "name": "features",
            "route": "/features",
          },
          {
            "children": [
              {
                "__metaPath": "src/content/themes/_meta.js",
              },
              {
                "children": [
                  {
                    "__metaPath": "src/content/themes/blog/_meta.js",
                  },
                  {
                    "__pagePath": "src/content/themes/blog/index.mdx",
                    "name": "index",
                    "route": "/themes/blog",
                  },
                ],
                "name": "blog",
                "route": "/themes/blog",
              },
              {
                "children": [
                  {
                    "__metaPath": "src/content/themes/docs/_meta.js",
                  },
                  {
                    "__pagePath": "src/content/themes/docs/bleed.mdx",
                    "name": "bleed",
                    "route": "/themes/docs/bleed",
                  },
                  {
                    "__pagePath": "src/content/themes/docs/callout.mdx",
                    "name": "callout",
                    "route": "/themes/docs/callout",
                  },
                  {
                    "__pagePath": "src/content/themes/docs/configuration.mdx",
                    "name": "configuration",
                    "route": "/themes/docs/configuration",
                  },
                  {
                    "__pagePath": "src/content/themes/docs/index.mdx",
                    "name": "index",
                    "route": "/themes/docs",
                  },
                  {
                    "__pagePath": "src/content/themes/docs/tabs.mdx",
                    "name": "tabs",
                    "route": "/themes/docs/tabs",
                  },
                ],
                "name": "docs",
                "route": "/themes/docs",
              },
            ],
            "name": "themes",
            "route": "/themes",
          },
          {
            "__pagePath": "src/app/blog/page.jsx",
            "name": "blog",
            "route": "/blog",
          },
          {
            "__pagePath": "src/content/index.mdx",
            "name": "index",
            "route": "/",
          },
          {
            "__pagePath": "src/app/showcase/(overview)/page.jsx",
            "name": "showcase",
            "route": "/showcase",
          },
          {
            "children": [
              {
                "__pagePath": "src/content/advanced/code-highlighting.mdx",
                "name": "code-highlighting",
                "route": "/advanced/code-highlighting",
              },
            ],
            "name": "advanced",
            "route": "/advanced",
          },
          {
            "__pagePath": "src/content/get-started.mdx",
            "name": "get-started",
            "route": "/get-started",
          },
          {
            "__pagePath": "src/content/mermaid.mdx",
            "name": "mermaid",
            "route": "/mermaid",
          },
          {
            "__pagePath": "src/content/page.mdx",
            "name": "page",
            "route": "/page",
          },
        ]
      `)
    })

    it('should match page map with base path', () => {
      const { pageMap, mdxPages } = convertToPageMap({
        filePaths,
        basePath: 'docs'
      })
      // Assert leading slash is removed when `basePath` is set
      // Assert we don't add pages from `app/` dir to `mdxPages`
      expect(mdxPages).toMatchInlineSnapshot(`
        {
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
          "themes/docs": "themes/docs/index.mdx",
          "themes/docs/bleed": "themes/docs/bleed.mdx",
          "themes/docs/callout": "themes/docs/callout.mdx",
          "themes/docs/configuration": "themes/docs/configuration.mdx",
          "themes/docs/tabs": "themes/docs/tabs.mdx",
        }
      `)
      expect(pageMap).toMatchInlineSnapshot(`
        [
          {
            "__metaPath": "src/app/_meta.js",
          },
          {
            "children": [
              {
                "__metaPath": "src/content/_meta.js",
              },
              {
                "children": [
                  {
                    "__metaPath": "src/content/features/_meta.js",
                  },
                  {
                    "__pagePath": "src/content/features/i18n.mdx",
                    "name": "i18n",
                    "route": "/docs/features/i18n",
                  },
                  {
                    "__pagePath": "src/content/features/image.mdx",
                    "name": "image",
                    "route": "/docs/features/image",
                  },
                  {
                    "__pagePath": "src/content/features/latex.mdx",
                    "name": "latex",
                    "route": "/docs/features/latex",
                  },
                  {
                    "__pagePath": "src/content/features/mdx.mdx",
                    "name": "mdx",
                    "route": "/docs/features/mdx",
                  },
                  {
                    "__pagePath": "src/content/features/ssg.mdx",
                    "name": "ssg",
                    "route": "/docs/features/ssg",
                  },
                  {
                    "__pagePath": "src/content/features/themes.mdx",
                    "name": "themes",
                    "route": "/docs/features/themes",
                  },
                ],
                "name": "features",
                "route": "/docs/features",
              },
              {
                "children": [
                  {
                    "__metaPath": "src/content/themes/_meta.js",
                  },
                  {
                    "children": [
                      {
                        "__metaPath": "src/content/themes/blog/_meta.js",
                      },
                      {
                        "__pagePath": "src/content/themes/blog/index.mdx",
                        "name": "index",
                        "route": "/docs/themes/blog",
                      },
                    ],
                    "name": "blog",
                    "route": "/docs/themes/blog",
                  },
                  {
                    "children": [
                      {
                        "__metaPath": "src/content/themes/docs/_meta.js",
                      },
                      {
                        "__pagePath": "src/content/themes/docs/bleed.mdx",
                        "name": "bleed",
                        "route": "/docs/themes/docs/bleed",
                      },
                      {
                        "__pagePath": "src/content/themes/docs/callout.mdx",
                        "name": "callout",
                        "route": "/docs/themes/docs/callout",
                      },
                      {
                        "__pagePath": "src/content/themes/docs/configuration.mdx",
                        "name": "configuration",
                        "route": "/docs/themes/docs/configuration",
                      },
                      {
                        "__pagePath": "src/content/themes/docs/index.mdx",
                        "name": "index",
                        "route": "/docs/themes/docs",
                      },
                      {
                        "__pagePath": "src/content/themes/docs/tabs.mdx",
                        "name": "tabs",
                        "route": "/docs/themes/docs/tabs",
                      },
                    ],
                    "name": "docs",
                    "route": "/docs/themes/docs",
                  },
                ],
                "name": "themes",
                "route": "/docs/themes",
              },
              {
                "children": [
                  {
                    "__pagePath": "src/content/advanced/code-highlighting.mdx",
                    "name": "code-highlighting",
                    "route": "/docs/advanced/code-highlighting",
                  },
                ],
                "name": "advanced",
                "route": "/docs/advanced",
              },
              {
                "__pagePath": "src/content/get-started.mdx",
                "name": "get-started",
                "route": "/docs/get-started",
              },
              {
                "__pagePath": "src/content/index.mdx",
                "name": "index",
                "route": "/docs",
              },
              {
                "__pagePath": "src/content/mermaid.mdx",
                "name": "mermaid",
                "route": "/docs/mermaid",
              },
              {
                "__pagePath": "src/content/page.mdx",
                "name": "page",
                "route": "/docs/page",
              },
            ],
            "name": "docs",
            "route": "/docs",
          },
          {
            "__pagePath": "src/app/blog/page.jsx",
            "name": "blog",
            "route": "/blog",
          },
          {
            "__pagePath": "src/app/page.jsx",
            "name": "index",
            "route": "/",
          },
          {
            "__pagePath": "src/app/showcase/(overview)/page.jsx",
            "name": "showcase",
            "route": "/showcase",
          },
        ]
      `)
    })
  })

  describe('should work for i18n example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'swr-site')
    const filePaths = await findMetaAndPageFilePaths({
      dir: path.join(cwd, 'app'),
      cwd,
      locale: 'en'
    })
    it('should match filepaths', () => {
      expect(filePaths).toMatchInlineSnapshot(`
        [
          "content/en/_meta.ts",
          "content/en/about/_meta.ts",
          "content/en/about/a-page.mdx",
          "content/en/about/acknowledgement.mdx",
          "content/en/about/changelog.md",
          "content/en/about/team.mdx",
          "content/en/blog.mdx",
          "content/en/blog/swr-v1.mdx",
          "content/en/docs/_meta.tsx",
          "content/en/docs/advanced.mdx",
          "content/en/docs/advanced/_meta.tsx",
          "content/en/docs/advanced/cache.mdx",
          "content/en/docs/advanced/code-highlighting.mdx",
          "content/en/docs/advanced/dynamic-markdown-import.mdx",
          "content/en/docs/advanced/file-name.with.DOTS.mdx",
          "content/en/docs/advanced/images.mdx",
          "content/en/docs/advanced/markdown-import.mdx",
          "content/en/docs/advanced/more/loooooooooooooooooooong-title.mdx",
          "content/en/docs/advanced/more/tree/one.mdx",
          "content/en/docs/advanced/more/tree/three.mdx",
          "content/en/docs/advanced/more/tree/two.mdx",
          "content/en/docs/advanced/performance.mdx",
          "content/en/docs/advanced/react-native.mdx",
          "content/en/docs/advanced/scrollbar-x.mdx",
          "content/en/docs/arguments.mdx",
          "content/en/docs/callout.mdx",
          "content/en/docs/change-log.mdx",
          "content/en/docs/code-block-without-language.mdx",
          "content/en/docs/conditional-fetching.md",
          "content/en/docs/custom-header-ids.mdx",
          "content/en/docs/data-fetching.mdx",
          "content/en/docs/error-handling.mdx",
          "content/en/docs/getting-started.mdx",
          "content/en/docs/global-configuration.md",
          "content/en/docs/middleware.mdx",
          "content/en/docs/mutation.md",
          "content/en/docs/options.mdx",
          "content/en/docs/pagination.mdx",
          "content/en/docs/prefetching.md",
          "content/en/docs/revalidation.mdx",
          "content/en/docs/suspense.mdx",
          "content/en/docs/typescript.mdx",
          "content/en/docs/understanding.mdx",
          "content/en/docs/with-nextjs.mdx",
          "content/en/docs/wrap-toc-items.mdx",
          "content/en/examples/_meta.ts",
          "content/en/examples/auth.mdx",
          "content/en/examples/basic.mdx",
          "content/en/examples/error-handling.mdx",
          "content/en/examples/full.mdx",
          "content/en/examples/infinite-loading.mdx",
          "content/en/examples/ssr.mdx",
          "content/en/foo.md",
          "content/en/index.mdx",
          "content/en/test.md",
        ]
      `)
    })

    it('should match page map', () => {
      const { pageMap, mdxPages } = convertToPageMap({
        filePaths,
        locale: 'en'
      })
      expect(mdxPages).toMatchInlineSnapshot(`
        {
          "": "index.mdx",
          "about/a-page": "about/a-page.mdx",
          "about/acknowledgement": "about/acknowledgement.mdx",
          "about/changelog": "about/changelog.md",
          "about/team": "about/team.mdx",
          "blog": "blog.mdx",
          "blog/swr-v1": "blog/swr-v1.mdx",
          "docs/advanced": "docs/advanced.mdx",
          "docs/advanced/cache": "docs/advanced/cache.mdx",
          "docs/advanced/code-highlighting": "docs/advanced/code-highlighting.mdx",
          "docs/advanced/dynamic-markdown-import": "docs/advanced/dynamic-markdown-import.mdx",
          "docs/advanced/file-name.with.DOTS": "docs/advanced/file-name.with.DOTS.mdx",
          "docs/advanced/images": "docs/advanced/images.mdx",
          "docs/advanced/markdown-import": "docs/advanced/markdown-import.mdx",
          "docs/advanced/more/loooooooooooooooooooong-title": "docs/advanced/more/loooooooooooooooooooong-title.mdx",
          "docs/advanced/more/tree/one": "docs/advanced/more/tree/one.mdx",
          "docs/advanced/more/tree/three": "docs/advanced/more/tree/three.mdx",
          "docs/advanced/more/tree/two": "docs/advanced/more/tree/two.mdx",
          "docs/advanced/performance": "docs/advanced/performance.mdx",
          "docs/advanced/react-native": "docs/advanced/react-native.mdx",
          "docs/advanced/scrollbar-x": "docs/advanced/scrollbar-x.mdx",
          "docs/arguments": "docs/arguments.mdx",
          "docs/callout": "docs/callout.mdx",
          "docs/change-log": "docs/change-log.mdx",
          "docs/code-block-without-language": "docs/code-block-without-language.mdx",
          "docs/conditional-fetching": "docs/conditional-fetching.md",
          "docs/custom-header-ids": "docs/custom-header-ids.mdx",
          "docs/data-fetching": "docs/data-fetching.mdx",
          "docs/error-handling": "docs/error-handling.mdx",
          "docs/getting-started": "docs/getting-started.mdx",
          "docs/global-configuration": "docs/global-configuration.md",
          "docs/middleware": "docs/middleware.mdx",
          "docs/mutation": "docs/mutation.md",
          "docs/options": "docs/options.mdx",
          "docs/pagination": "docs/pagination.mdx",
          "docs/prefetching": "docs/prefetching.md",
          "docs/revalidation": "docs/revalidation.mdx",
          "docs/suspense": "docs/suspense.mdx",
          "docs/typescript": "docs/typescript.mdx",
          "docs/understanding": "docs/understanding.mdx",
          "docs/with-nextjs": "docs/with-nextjs.mdx",
          "docs/wrap-toc-items": "docs/wrap-toc-items.mdx",
          "examples/auth": "examples/auth.mdx",
          "examples/basic": "examples/basic.mdx",
          "examples/error-handling": "examples/error-handling.mdx",
          "examples/full": "examples/full.mdx",
          "examples/infinite-loading": "examples/infinite-loading.mdx",
          "examples/ssr": "examples/ssr.mdx",
          "foo": "foo.md",
          "test": "test.md",
        }
      `)
      expect(pageMap).toMatchInlineSnapshot(`
        [
          {
            "__metaPath": "content/en/_meta.ts",
          },
          {
            "children": [
              {
                "__metaPath": "content/en/about/_meta.ts",
              },
              {
                "__pagePath": "content/en/about/a-page.mdx",
                "name": "a-page",
                "route": "/about/a-page",
              },
              {
                "__pagePath": "content/en/about/acknowledgement.mdx",
                "name": "acknowledgement",
                "route": "/about/acknowledgement",
              },
              {
                "__pagePath": "content/en/about/changelog.md",
                "name": "changelog",
                "route": "/about/changelog",
              },
              {
                "__pagePath": "content/en/about/team.mdx",
                "name": "team",
                "route": "/about/team",
              },
            ],
            "name": "about",
            "route": "/about",
          },
          {
            "children": [
              {
                "__metaPath": "content/en/docs/_meta.tsx",
              },
              {
                "children": [
                  {
                    "__metaPath": "content/en/docs/advanced/_meta.tsx",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced.mdx",
                    "name": "index",
                    "route": "/docs/advanced",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/cache.mdx",
                    "name": "cache",
                    "route": "/docs/advanced/cache",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/code-highlighting.mdx",
                    "name": "code-highlighting",
                    "route": "/docs/advanced/code-highlighting",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/dynamic-markdown-import.mdx",
                    "name": "dynamic-markdown-import",
                    "route": "/docs/advanced/dynamic-markdown-import",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/file-name.with.DOTS.mdx",
                    "name": "file-name.with.DOTS",
                    "route": "/docs/advanced/file-name.with.DOTS",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/images.mdx",
                    "name": "images",
                    "route": "/docs/advanced/images",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/markdown-import.mdx",
                    "name": "markdown-import",
                    "route": "/docs/advanced/markdown-import",
                  },
                  {
                    "children": [
                      {
                        "__pagePath": "content/en/docs/advanced/more/loooooooooooooooooooong-title.mdx",
                        "name": "loooooooooooooooooooong-title",
                        "route": "/docs/advanced/more/loooooooooooooooooooong-title",
                      },
                      {
                        "children": [
                          {
                            "__pagePath": "content/en/docs/advanced/more/tree/one.mdx",
                            "name": "one",
                            "route": "/docs/advanced/more/tree/one",
                          },
                          {
                            "__pagePath": "content/en/docs/advanced/more/tree/three.mdx",
                            "name": "three",
                            "route": "/docs/advanced/more/tree/three",
                          },
                          {
                            "__pagePath": "content/en/docs/advanced/more/tree/two.mdx",
                            "name": "two",
                            "route": "/docs/advanced/more/tree/two",
                          },
                        ],
                        "name": "tree",
                        "route": "/docs/advanced/more/tree",
                      },
                    ],
                    "name": "more",
                    "route": "/docs/advanced/more",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/performance.mdx",
                    "name": "performance",
                    "route": "/docs/advanced/performance",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/react-native.mdx",
                    "name": "react-native",
                    "route": "/docs/advanced/react-native",
                  },
                  {
                    "__pagePath": "content/en/docs/advanced/scrollbar-x.mdx",
                    "name": "scrollbar-x",
                    "route": "/docs/advanced/scrollbar-x",
                  },
                ],
                "name": "advanced",
                "route": "/docs/advanced",
              },
              {
                "__pagePath": "content/en/docs/arguments.mdx",
                "name": "arguments",
                "route": "/docs/arguments",
              },
              {
                "__pagePath": "content/en/docs/callout.mdx",
                "name": "callout",
                "route": "/docs/callout",
              },
              {
                "__pagePath": "content/en/docs/change-log.mdx",
                "name": "change-log",
                "route": "/docs/change-log",
              },
              {
                "__pagePath": "content/en/docs/code-block-without-language.mdx",
                "name": "code-block-without-language",
                "route": "/docs/code-block-without-language",
              },
              {
                "__pagePath": "content/en/docs/conditional-fetching.md",
                "name": "conditional-fetching",
                "route": "/docs/conditional-fetching",
              },
              {
                "__pagePath": "content/en/docs/custom-header-ids.mdx",
                "name": "custom-header-ids",
                "route": "/docs/custom-header-ids",
              },
              {
                "__pagePath": "content/en/docs/data-fetching.mdx",
                "name": "data-fetching",
                "route": "/docs/data-fetching",
              },
              {
                "__pagePath": "content/en/docs/error-handling.mdx",
                "name": "error-handling",
                "route": "/docs/error-handling",
              },
              {
                "__pagePath": "content/en/docs/getting-started.mdx",
                "name": "getting-started",
                "route": "/docs/getting-started",
              },
              {
                "__pagePath": "content/en/docs/global-configuration.md",
                "name": "global-configuration",
                "route": "/docs/global-configuration",
              },
              {
                "__pagePath": "content/en/docs/middleware.mdx",
                "name": "middleware",
                "route": "/docs/middleware",
              },
              {
                "__pagePath": "content/en/docs/mutation.md",
                "name": "mutation",
                "route": "/docs/mutation",
              },
              {
                "__pagePath": "content/en/docs/options.mdx",
                "name": "options",
                "route": "/docs/options",
              },
              {
                "__pagePath": "content/en/docs/pagination.mdx",
                "name": "pagination",
                "route": "/docs/pagination",
              },
              {
                "__pagePath": "content/en/docs/prefetching.md",
                "name": "prefetching",
                "route": "/docs/prefetching",
              },
              {
                "__pagePath": "content/en/docs/revalidation.mdx",
                "name": "revalidation",
                "route": "/docs/revalidation",
              },
              {
                "__pagePath": "content/en/docs/suspense.mdx",
                "name": "suspense",
                "route": "/docs/suspense",
              },
              {
                "__pagePath": "content/en/docs/typescript.mdx",
                "name": "typescript",
                "route": "/docs/typescript",
              },
              {
                "__pagePath": "content/en/docs/understanding.mdx",
                "name": "understanding",
                "route": "/docs/understanding",
              },
              {
                "__pagePath": "content/en/docs/with-nextjs.mdx",
                "name": "with-nextjs",
                "route": "/docs/with-nextjs",
              },
              {
                "__pagePath": "content/en/docs/wrap-toc-items.mdx",
                "name": "wrap-toc-items",
                "route": "/docs/wrap-toc-items",
              },
            ],
            "name": "docs",
            "route": "/docs",
          },
          {
            "children": [
              {
                "__metaPath": "content/en/examples/_meta.ts",
              },
              {
                "__pagePath": "content/en/examples/auth.mdx",
                "name": "auth",
                "route": "/examples/auth",
              },
              {
                "__pagePath": "content/en/examples/basic.mdx",
                "name": "basic",
                "route": "/examples/basic",
              },
              {
                "__pagePath": "content/en/examples/error-handling.mdx",
                "name": "error-handling",
                "route": "/examples/error-handling",
              },
              {
                "__pagePath": "content/en/examples/full.mdx",
                "name": "full",
                "route": "/examples/full",
              },
              {
                "__pagePath": "content/en/examples/infinite-loading.mdx",
                "name": "infinite-loading",
                "route": "/examples/infinite-loading",
              },
              {
                "__pagePath": "content/en/examples/ssr.mdx",
                "name": "ssr",
                "route": "/examples/ssr",
              },
            ],
            "name": "examples",
            "route": "/examples",
          },
          {
            "children": [
              {
                "__pagePath": "content/en/blog.mdx",
                "name": "index",
                "route": "/blog",
              },
              {
                "__pagePath": "content/en/blog/swr-v1.mdx",
                "name": "swr-v1",
                "route": "/blog/swr-v1",
              },
            ],
            "name": "blog",
            "route": "/blog",
          },
          {
            "__pagePath": "content/en/foo.md",
            "name": "foo",
            "route": "/foo",
          },
          {
            "__pagePath": "content/en/index.mdx",
            "name": "index",
            "route": "/",
          },
          {
            "__pagePath": "content/en/test.md",
            "name": "test",
            "route": "/test",
          },
        ]
      `)
    })
  })

  it('should add `basePath` for graphql-eslint where there is no `content` dir', () => {
    const { mdxPages, pageMap } = convertToPageMap({
      filePaths: [
        'configs.mdx',
        'custom-rules.mdx',
        'getting-started.mdx',
        'getting-started/parser-options.mdx',
        'getting-started/parser.mdx',
        'index.mdx'
      ],
      basePath: 'remote/graphql-eslint'
    })
    expect(mdxPages).toMatchInlineSnapshot(`
      {
        "": "index.mdx",
        "configs": "configs.mdx",
        "custom-rules": "custom-rules.mdx",
        "getting-started": "getting-started.mdx",
        "getting-started/parser": "getting-started/parser.mdx",
        "getting-started/parser-options": "getting-started/parser-options.mdx",
      }
    `)
    expect(pageMap).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "__pagePath": "configs.mdx",
                  "name": "configs",
                  "route": "/remote/graphql-eslint/configs",
                },
                {
                  "__pagePath": "custom-rules.mdx",
                  "name": "custom-rules",
                  "route": "/remote/graphql-eslint/custom-rules",
                },
                {
                  "children": [
                    {
                      "__pagePath": "getting-started.mdx",
                      "name": "index",
                      "route": "/remote/graphql-eslint/getting-started",
                    },
                    {
                      "__pagePath": "getting-started/parser-options.mdx",
                      "name": "parser-options",
                      "route": "/remote/graphql-eslint/getting-started/parser-options",
                    },
                    {
                      "__pagePath": "getting-started/parser.mdx",
                      "name": "parser",
                      "route": "/remote/graphql-eslint/getting-started/parser",
                    },
                  ],
                  "name": "getting-started",
                  "route": "/remote/graphql-eslint/getting-started",
                },
                {
                  "__pagePath": "index.mdx",
                  "name": "index",
                  "route": "/remote/graphql-eslint",
                },
              ],
              "name": "graphql-eslint",
              "route": "/remote/graphql-eslint",
            },
          ],
          "name": "remote",
          "route": "/remote",
        },
      ]
    `)
  })
})
