import path from 'node:path'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import { CWD } from '../src/server/constants.js'
import {
  generatePageMap,
  getFilepaths
} from '../src/server/generate-page-map.js'

describe('generatePageMapFromFilepaths()', () => {
  it('should work for blog example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'blog')
    const { appDir } = findPagesDir(cwd)

    const filePaths = await getFilepaths({ dir: appDir!, cwd })
    const { pageMap } = generatePageMap({ filePaths })
    expect(filePaths).toMatchInlineSnapshot(`
      [
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
    const { appDir } = findPagesDir(cwd)

    const filePaths = await getFilepaths({ dir: appDir!, cwd })
    const { pageMap } = generatePageMap({ filePaths })
    expect(filePaths).toMatchInlineSnapshot(`
      [
        "app/_meta.ts",
        "app/about/page.mdx",
        "app/blog/page.mdx",
        "app/docs/_meta.ts",
        "app/docs/advanced/_meta.ts",
        "app/docs/advanced/customize-the-cascade-layers/page.mdx",
        "app/docs/advanced/latex/page.mdx",
        "app/docs/advanced/mermaid/page.mdx",
        "app/docs/advanced/npm2yarn/page.mdx",
        "app/docs/advanced/page.mdx",
        "app/docs/advanced/playground/page.mdx",
        "app/docs/advanced/remote/page.mdx",
        "app/docs/advanced/table/page.mdx",
        "app/docs/advanced/tailwind-css/page.mdx",
        "app/docs/advanced/twoslash/page.mdx",
        "app/docs/advanced/typescript/page.mdx",
        "app/docs/blog-theme/page.mdx",
        "app/docs/blog-theme/start/page.mdx",
        "app/docs/built-ins/_meta.ts",
        "app/docs/built-ins/banner/page.mdx",
        "app/docs/built-ins/bleed/page.mdx",
        "app/docs/built-ins/callout/page.mdx",
        "app/docs/built-ins/cards/page.mdx",
        "app/docs/built-ins/filetree/page.mdx",
        "app/docs/built-ins/head/page.mdx",
        "app/docs/built-ins/page.mdx",
        "app/docs/built-ins/search/page.mdx",
        "app/docs/built-ins/steps/page.mdx",
        "app/docs/built-ins/tabs/page.mdx",
        "app/docs/custom-theme/page.mdx",
        "app/docs/docs-theme/_meta.ts",
        "app/docs/docs-theme/api/page.mdx",
        "app/docs/docs-theme/built-ins/footer/page.mdx",
        "app/docs/docs-theme/built-ins/layout/page.mdx",
        "app/docs/docs-theme/built-ins/navbar/page.mdx",
        "app/docs/docs-theme/built-ins/not-found/page.mdx",
        "app/docs/docs-theme/page-configuration/page.mdx",
        "app/docs/docs-theme/page.mdx",
        "app/docs/docs-theme/start/page.mdx",
        "app/docs/guide/_meta.ts",
        "app/docs/guide/custom-css/page.mdx",
        "app/docs/guide/github-alert-syntax/page.mdx",
        "app/docs/guide/i18n/page.mdx",
        "app/docs/guide/image/page.mdx",
        "app/docs/guide/link/page.mdx",
        "app/docs/guide/markdown/page.mdx",
        "app/docs/guide/organize-files/page.mdx",
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
            "__metaPath": "app/_meta.ts",
          },
          {
            "children": [
              {
                "__metaPath": "app/docs/_meta.ts",
              },
              {
                "children": [
                  {
                    "__metaPath": "app/docs/advanced/_meta.ts",
                  },
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
                    "__pagePath": "app/docs/advanced/playground/page.mdx",
                    "name": "playground",
                    "route": "/docs/advanced/playground",
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
                    "__metaPath": "app/docs/built-ins/_meta.ts",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/banner/page.mdx",
                    "name": "banner",
                    "route": "/docs/built-ins/banner",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/bleed/page.mdx",
                    "name": "bleed",
                    "route": "/docs/built-ins/bleed",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/callout/page.mdx",
                    "name": "callout",
                    "route": "/docs/built-ins/callout",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/cards/page.mdx",
                    "name": "cards",
                    "route": "/docs/built-ins/cards",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/filetree/page.mdx",
                    "name": "filetree",
                    "route": "/docs/built-ins/filetree",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/head/page.mdx",
                    "name": "head",
                    "route": "/docs/built-ins/head",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/page.mdx",
                    "name": "index",
                    "route": "/docs/built-ins",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/search/page.mdx",
                    "name": "search",
                    "route": "/docs/built-ins/search",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/steps/page.mdx",
                    "name": "steps",
                    "route": "/docs/built-ins/steps",
                  },
                  {
                    "__pagePath": "app/docs/built-ins/tabs/page.mdx",
                    "name": "tabs",
                    "route": "/docs/built-ins/tabs",
                  },
                ],
                "name": "built-ins",
                "route": "/docs/built-ins",
              },
              {
                "children": [
                  {
                    "__metaPath": "app/docs/docs-theme/_meta.ts",
                  },
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
                    ],
                    "name": "built-ins",
                    "route": "/docs/docs-theme/built-ins",
                  },
                  {
                    "__pagePath": "app/docs/docs-theme/page-configuration/page.mdx",
                    "name": "page-configuration",
                    "route": "/docs/docs-theme/page-configuration",
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
                    "__metaPath": "app/docs/guide/_meta.ts",
                  },
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
                    "__pagePath": "app/docs/guide/organize-files/page.mdx",
                    "name": "organize-files",
                    "route": "/docs/guide/organize-files",
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
                "children": [
                  {
                    "__pagePath": "app/docs/blog-theme/page.mdx",
                    "name": "index",
                    "route": "/docs/blog-theme",
                  },
                  {
                    "__pagePath": "app/docs/blog-theme/start/page.mdx",
                    "name": "start",
                    "route": "/docs/blog-theme/start",
                  },
                ],
                "name": "blog-theme",
                "route": "/docs/blog-theme",
              },
              {
                "__pagePath": "app/docs/custom-theme/page.mdx",
                "name": "custom-theme",
                "route": "/docs/custom-theme",
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
            "__pagePath": "app/about/page.mdx",
            "name": "about",
            "route": "/about",
          },
          {
            "__pagePath": "app/blog/page.mdx",
            "name": "blog",
            "route": "/blog",
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
  })

  describe('should work for docs example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'docs')
    const { appDir } = findPagesDir(cwd)
    const filePaths = await getFilepaths({ dir: appDir!, cwd })
    it('should match filepaths', () => {
      expect(filePaths).toMatchInlineSnapshot(`
        [
          "app/_meta.js",
          "app/blog/page.jsx",
          "app/page.jsx",
          "content/_meta.js",
          "content/advanced/code-highlighting.mdx",
          "content/features/_meta.js",
          "content/features/i18n.mdx",
          "content/features/image.mdx",
          "content/features/latex.mdx",
          "content/features/mdx.mdx",
          "content/features/ssg.mdx",
          "content/features/themes.mdx",
          "content/get-started.mdx",
          "content/index.mdx",
          "content/themes/_meta.js",
          "content/themes/blog/_meta.js",
          "content/themes/blog/index.mdx",
          "content/themes/docs/_meta.js",
          "content/themes/docs/bleed.mdx",
          "content/themes/docs/callout.mdx",
          "content/themes/docs/configuration.mdx",
          "content/themes/docs/index.mdx",
          "content/themes/docs/tabs.mdx",
        ]
      `)
    })
    it('should match page map', () => {
      const { pageMap } = generatePageMap({ filePaths })
      expect(pageMap).toMatchInlineSnapshot(`
          [
            {
              "__metaPath": "content/_meta.js",
            },
            {
              "children": [
                {
                  "__metaPath": "content/features/_meta.js",
                },
                {
                  "__pagePath": "content/features/i18n.mdx",
                  "name": "i18n",
                  "route": "/features/i18n",
                },
                {
                  "__pagePath": "content/features/image.mdx",
                  "name": "image",
                  "route": "/features/image",
                },
                {
                  "__pagePath": "content/features/latex.mdx",
                  "name": "latex",
                  "route": "/features/latex",
                },
                {
                  "__pagePath": "content/features/mdx.mdx",
                  "name": "mdx",
                  "route": "/features/mdx",
                },
                {
                  "__pagePath": "content/features/ssg.mdx",
                  "name": "ssg",
                  "route": "/features/ssg",
                },
                {
                  "__pagePath": "content/features/themes.mdx",
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
                  "__metaPath": "content/themes/_meta.js",
                },
                {
                  "children": [
                    {
                      "__metaPath": "content/themes/blog/_meta.js",
                    },
                    {
                      "__pagePath": "content/themes/blog/index.mdx",
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
                      "__metaPath": "content/themes/docs/_meta.js",
                    },
                    {
                      "__pagePath": "content/themes/docs/bleed.mdx",
                      "name": "bleed",
                      "route": "/themes/docs/bleed",
                    },
                    {
                      "__pagePath": "content/themes/docs/callout.mdx",
                      "name": "callout",
                      "route": "/themes/docs/callout",
                    },
                    {
                      "__pagePath": "content/themes/docs/configuration.mdx",
                      "name": "configuration",
                      "route": "/themes/docs/configuration",
                    },
                    {
                      "__pagePath": "content/themes/docs/index.mdx",
                      "name": "index",
                      "route": "/themes/docs",
                    },
                    {
                      "__pagePath": "content/themes/docs/tabs.mdx",
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
              "__pagePath": "app/blog/page.jsx",
              "name": "blog",
              "route": "/blog",
            },
            {
              "__pagePath": "content/index.mdx",
              "name": "index",
              "route": "/",
            },
            {
              "children": [
                {
                  "__pagePath": "content/advanced/code-highlighting.mdx",
                  "name": "code-highlighting",
                  "route": "/advanced/code-highlighting",
                },
              ],
              "name": "advanced",
              "route": "/advanced",
            },
            {
              "__pagePath": "content/get-started.mdx",
              "name": "get-started",
              "route": "/get-started",
            },
          ]
        `)
    })

    it('should match page map with base path', () => {
      const { pageMap, mdxPages } = generatePageMap({
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
              "__metaPath": "app/_meta.js",
            },
            {
              "children": [
                {
                  "__metaPath": "content/_meta.js",
                },
                {
                  "children": [
                    {
                      "__metaPath": "content/features/_meta.js",
                    },
                    {
                      "__pagePath": "content/features/i18n.mdx",
                      "name": "i18n",
                      "route": "/docs/features/i18n",
                    },
                    {
                      "__pagePath": "content/features/image.mdx",
                      "name": "image",
                      "route": "/docs/features/image",
                    },
                    {
                      "__pagePath": "content/features/latex.mdx",
                      "name": "latex",
                      "route": "/docs/features/latex",
                    },
                    {
                      "__pagePath": "content/features/mdx.mdx",
                      "name": "mdx",
                      "route": "/docs/features/mdx",
                    },
                    {
                      "__pagePath": "content/features/ssg.mdx",
                      "name": "ssg",
                      "route": "/docs/features/ssg",
                    },
                    {
                      "__pagePath": "content/features/themes.mdx",
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
                      "__metaPath": "content/themes/_meta.js",
                    },
                    {
                      "children": [
                        {
                          "__metaPath": "content/themes/blog/_meta.js",
                        },
                        {
                          "__pagePath": "content/themes/blog/index.mdx",
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
                          "__metaPath": "content/themes/docs/_meta.js",
                        },
                        {
                          "__pagePath": "content/themes/docs/bleed.mdx",
                          "name": "bleed",
                          "route": "/docs/themes/docs/bleed",
                        },
                        {
                          "__pagePath": "content/themes/docs/callout.mdx",
                          "name": "callout",
                          "route": "/docs/themes/docs/callout",
                        },
                        {
                          "__pagePath": "content/themes/docs/configuration.mdx",
                          "name": "configuration",
                          "route": "/docs/themes/docs/configuration",
                        },
                        {
                          "__pagePath": "content/themes/docs/index.mdx",
                          "name": "index",
                          "route": "/docs/themes/docs",
                        },
                        {
                          "__pagePath": "content/themes/docs/tabs.mdx",
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
                      "__pagePath": "content/advanced/code-highlighting.mdx",
                      "name": "code-highlighting",
                      "route": "/docs/advanced/code-highlighting",
                    },
                  ],
                  "name": "advanced",
                  "route": "/docs/advanced",
                },
                {
                  "__pagePath": "content/get-started.mdx",
                  "name": "get-started",
                  "route": "/docs/get-started",
                },
                {
                  "__pagePath": "content/index.mdx",
                  "name": "index",
                  "route": "/docs",
                },
              ],
              "name": "docs",
              "route": "/docs",
            },
            {
              "__pagePath": "app/blog/page.jsx",
              "name": "blog",
              "route": "/blog",
            },
            {
              "__pagePath": "app/page.jsx",
              "name": "index",
              "route": "/",
            },
          ]
        `)
    })
  })

  describe('should work for i18n example', async () => {
    const cwd = path.join(CWD, '..', '..', 'examples', 'swr-site')
    const { appDir } = findPagesDir(cwd)
    const filePaths = await getFilepaths({ dir: appDir!, cwd, locale: 'en' })
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
      const { pageMap, mdxPages } = generatePageMap({
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
})
