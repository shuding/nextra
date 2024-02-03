import path from 'node:path'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import { generatePageMapFromFilepaths, getFilepaths } from './generate-page-map'

describe('generatePageMapFromFilepaths()', () => {
  it('should work for blog example', async () => {
    const cwd = path.join(process.cwd(), '..', '..', 'examples', 'blog')
    const { appDir } = findPagesDir(cwd)

    const pagePaths = await getFilepaths({ dir: appDir!, cwd, isAppDir: true })
    expect(pagePaths.sort((a, b) => a.localeCompare(b))).toMatchInlineSnapshot(`
      [
        "page.mdx",
        "posts/(with-comments)/aaron-swartz-a-programmable-web/page.mdx",
        "posts/(with-comments)/code-blocks/page.mdx",
        "posts/(with-comments)/draft/page.mdx",
        "posts/(with-comments)/nextra-components/page.mdx",
        "posts/(with-comments)/table/page.mdx",
        "posts/page.jsx",
        "tags/[tag]/page.jsx",
      ]
    `)
    expect(generatePageMapFromFilepaths(pagePaths).pageMap).toMatchInlineSnapshot(`
      [
        {
          "__pagePath": "page.mdx",
          "name": "index",
          "route": "/",
        },
        {
          "children": [
            {
              "__pagePath": "posts/(with-comments)/aaron-swartz-a-programmable-web/page.mdx",
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
            {
              "__pagePath": "posts/(with-comments)/code-blocks/page.mdx",
              "name": "code-blocks",
              "route": "/posts/code-blocks",
            },
            {
              "__pagePath": "posts/(with-comments)/draft/page.mdx",
              "name": "draft",
              "route": "/posts/draft",
            },
            {
              "__pagePath": "posts/page.jsx",
              "name": "index",
              "route": "/posts",
            },
            {
              "__pagePath": "posts/(with-comments)/nextra-components/page.mdx",
              "name": "nextra-components",
              "route": "/posts/nextra-components",
            },
            {
              "__pagePath": "posts/(with-comments)/table/page.mdx",
              "name": "table",
              "route": "/posts/table",
            },
          ],
          "name": "posts",
          "route": "/posts",
        },
        {
          "children": [
            {
              "name": "[tag]",
              "route": "/tags/[tag]",
            },
          ],
          "name": "tags",
          "route": "/tags",
        },
      ]
    `)
  })

  it('should work for nextra.site', async () => {
    const cwd = path.join(process.cwd(), '..', '..', 'docs')
    const { appDir } = findPagesDir(cwd)

    const pagePaths = await getFilepaths({ dir: appDir!, cwd, isAppDir: true })
    expect(pagePaths.sort((a, b) => a.localeCompare(b))).toMatchInlineSnapshot(`
      [
        "_meta.ts",
        "about/page.mdx",
        "docs/_meta.ts",
        "docs/blog-theme/page.mdx",
        "docs/blog-theme/start/page.mdx",
        "docs/custom-theme/page.mdx",
        "docs/docs-theme/_meta.ts",
        "docs/docs-theme/api/use-config/page.mdx",
        "docs/docs-theme/built-ins/bleed/page.mdx",
        "docs/docs-theme/built-ins/page.mdx",
        "docs/docs-theme/page-configuration/page.mdx",
        "docs/docs-theme/page.mdx",
        "docs/docs-theme/start/page.mdx",
        "docs/docs-theme/theme-configuration/page.mdx",
        "docs/guide/_meta.ts",
        "docs/guide/advanced/_meta.ts",
        "docs/guide/advanced/latex/page.mdx",
        "docs/guide/advanced/mermaid/page.mdx",
        "docs/guide/advanced/npm2yarn/page.mdx",
        "docs/guide/advanced/page.mdx",
        "docs/guide/advanced/remote/page.mdx",
        "docs/guide/advanced/table/page.mdx",
        "docs/guide/advanced/tailwind-css/page.mdx",
        "docs/guide/advanced/typescript/page.mdx",
        "docs/guide/built-ins/_meta.ts",
        "docs/guide/built-ins/callout/page.mdx",
        "docs/guide/built-ins/cards/page.mdx",
        "docs/guide/built-ins/filetree/page.mdx",
        "docs/guide/built-ins/page.mdx",
        "docs/guide/built-ins/steps/page.mdx",
        "docs/guide/built-ins/tabs/page.mdx",
        "docs/guide/custom-css/page.mdx",
        "docs/guide/i18n/page.mdx",
        "docs/guide/image/page.mdx",
        "docs/guide/link/page.mdx",
        "docs/guide/markdown/page.mdx",
        "docs/guide/organize-files/page.mdx",
        "docs/guide/page.mdx",
        "docs/guide/ssg/page.mdx",
        "docs/guide/syntax-highlighting/page.mdx",
        "docs/guide/twoslash/page.mdx",
        "docs/page.mdx",
        "page.tsx",
        "showcase/page.mdx",
      ]
    `)

    expect(generatePageMapFromFilepaths(pagePaths).pageMap)
      .toMatchInlineSnapshot(`
      [
        {
          "__pagePath": "about/page.mdx",
          "name": "about",
          "route": "/about",
        },
        {
          "children": [
            {
              "children": [
                {
                  "__pagePath": "docs/blog-theme/page.mdx",
                  "name": "index",
                  "route": "/docs/blog-theme",
                },
                {
                  "__pagePath": "docs/blog-theme/start/page.mdx",
                  "name": "start",
                  "route": "/docs/blog-theme/start",
                },
              ],
              "name": "blog-theme",
              "route": "/docs/blog-theme",
            },
            {
              "__pagePath": "docs/custom-theme/page.mdx",
              "name": "custom-theme",
              "route": "/docs/custom-theme",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "__pagePath": "docs/docs-theme/api/use-config/page.mdx",
                      "name": "use-config",
                      "route": "/docs/docs-theme/api/use-config",
                    },
                  ],
                  "name": "api",
                  "route": "/docs/docs-theme/api",
                },
                {
                  "children": [
                    {
                      "__pagePath": "docs/docs-theme/built-ins/bleed/page.mdx",
                      "name": "bleed",
                      "route": "/docs/docs-theme/built-ins/bleed",
                    },
                    {
                      "__pagePath": "docs/docs-theme/built-ins/page.mdx",
                      "name": "index",
                      "route": "/docs/docs-theme/built-ins",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/docs-theme/built-ins",
                },
                {
                  "__pagePath": "docs/docs-theme/page.mdx",
                  "name": "index",
                  "route": "/docs/docs-theme",
                },
                {
                  "__pagePath": "docs/docs-theme/page-configuration/page.mdx",
                  "name": "page-configuration",
                  "route": "/docs/docs-theme/page-configuration",
                },
                {
                  "__pagePath": "docs/docs-theme/start/page.mdx",
                  "name": "start",
                  "route": "/docs/docs-theme/start",
                },
                {
                  "__pagePath": "docs/docs-theme/theme-configuration/page.mdx",
                  "name": "theme-configuration",
                  "route": "/docs/docs-theme/theme-configuration",
                },
                {
                  "__metaPath": "docs/docs-theme/_meta.ts",
                },
              ],
              "name": "docs-theme",
              "route": "/docs/docs-theme",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "__pagePath": "docs/guide/advanced/page.mdx",
                      "name": "index",
                      "route": "/docs/guide/advanced",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/latex/page.mdx",
                      "name": "latex",
                      "route": "/docs/guide/advanced/latex",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/mermaid/page.mdx",
                      "name": "mermaid",
                      "route": "/docs/guide/advanced/mermaid",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/npm2yarn/page.mdx",
                      "name": "npm2yarn",
                      "route": "/docs/guide/advanced/npm2yarn",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/remote/page.mdx",
                      "name": "remote",
                      "route": "/docs/guide/advanced/remote",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/table/page.mdx",
                      "name": "table",
                      "route": "/docs/guide/advanced/table",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/tailwind-css/page.mdx",
                      "name": "tailwind-css",
                      "route": "/docs/guide/advanced/tailwind-css",
                    },
                    {
                      "__pagePath": "docs/guide/advanced/typescript/page.mdx",
                      "name": "typescript",
                      "route": "/docs/guide/advanced/typescript",
                    },
                    {
                      "__metaPath": "docs/guide/advanced/_meta.ts",
                    },
                  ],
                  "name": "advanced",
                  "route": "/docs/guide/advanced",
                },
                {
                  "children": [
                    {
                      "__pagePath": "docs/guide/built-ins/callout/page.mdx",
                      "name": "callout",
                      "route": "/docs/guide/built-ins/callout",
                    },
                    {
                      "__pagePath": "docs/guide/built-ins/cards/page.mdx",
                      "name": "cards",
                      "route": "/docs/guide/built-ins/cards",
                    },
                    {
                      "__pagePath": "docs/guide/built-ins/filetree/page.mdx",
                      "name": "filetree",
                      "route": "/docs/guide/built-ins/filetree",
                    },
                    {
                      "__pagePath": "docs/guide/built-ins/page.mdx",
                      "name": "index",
                      "route": "/docs/guide/built-ins",
                    },
                    {
                      "__pagePath": "docs/guide/built-ins/steps/page.mdx",
                      "name": "steps",
                      "route": "/docs/guide/built-ins/steps",
                    },
                    {
                      "__pagePath": "docs/guide/built-ins/tabs/page.mdx",
                      "name": "tabs",
                      "route": "/docs/guide/built-ins/tabs",
                    },
                    {
                      "__metaPath": "docs/guide/built-ins/_meta.ts",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/guide/built-ins",
                },
                {
                  "__pagePath": "docs/guide/custom-css/page.mdx",
                  "name": "custom-css",
                  "route": "/docs/guide/custom-css",
                },
                {
                  "__pagePath": "docs/guide/i18n/page.mdx",
                  "name": "i18n",
                  "route": "/docs/guide/i18n",
                },
                {
                  "__pagePath": "docs/guide/image/page.mdx",
                  "name": "image",
                  "route": "/docs/guide/image",
                },
                {
                  "__pagePath": "docs/guide/page.mdx",
                  "name": "index",
                  "route": "/docs/guide",
                },
                {
                  "__pagePath": "docs/guide/link/page.mdx",
                  "name": "link",
                  "route": "/docs/guide/link",
                },
                {
                  "__pagePath": "docs/guide/markdown/page.mdx",
                  "name": "markdown",
                  "route": "/docs/guide/markdown",
                },
                {
                  "__pagePath": "docs/guide/organize-files/page.mdx",
                  "name": "organize-files",
                  "route": "/docs/guide/organize-files",
                },
                {
                  "__pagePath": "docs/guide/ssg/page.mdx",
                  "name": "ssg",
                  "route": "/docs/guide/ssg",
                },
                {
                  "__pagePath": "docs/guide/syntax-highlighting/page.mdx",
                  "name": "syntax-highlighting",
                  "route": "/docs/guide/syntax-highlighting",
                },
                {
                  "__pagePath": "docs/guide/twoslash/page.mdx",
                  "name": "twoslash",
                  "route": "/docs/guide/twoslash",
                },
                {
                  "__metaPath": "docs/guide/_meta.ts",
                },
              ],
              "name": "guide",
              "route": "/docs/guide",
            },
            {
              "__pagePath": "docs/page.mdx",
              "name": "index",
              "route": "/docs",
            },
            {
              "__metaPath": "docs/_meta.ts",
            },
          ],
          "name": "docs",
          "route": "/docs",
        },
        {
          "__pagePath": "page.tsx",
          "name": "index",
          "route": "/",
        },
        {
          "__pagePath": "showcase/page.mdx",
          "name": "showcase",
          "route": "/showcase",
        },
        {
          "__metaPath": "_meta.ts",
        },
      ]
    `)
  })

  it('should work for docs example', async () => {
    const cwd = path.join(process.cwd(), '..', '..', 'examples', 'docs')
    const pagePaths = await getFilepaths({ dir: path.join(cwd, 'mdx'), cwd })
    expect(pagePaths.sort((a, b) => a.localeCompare(b))).toMatchInlineSnapshot(`
      [
        "_meta.js",
        "advanced/code-highlighting.mdx",
        "features/_meta.js",
        "features/i18n.mdx",
        "features/image.mdx",
        "features/latex.mdx",
        "features/mdx.mdx",
        "features/ssg.mdx",
        "features/themes.mdx",
        "get-started.mdx",
        "index.mdx",
        "themes/_meta.js",
        "themes/blog/_meta.js",
        "themes/blog/index.mdx",
        "themes/docs/_meta.js",
        "themes/docs/bleed.mdx",
        "themes/docs/callout.mdx",
        "themes/docs/configuration.mdx",
        "themes/docs/index.mdx",
        "themes/docs/tabs.mdx",
      ]
    `)
    expect(generatePageMapFromFilepaths(pagePaths).pageMap)
      .toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "__pagePath": "advanced/code-highlighting.mdx",
              "name": "code-highlighting",
              "route": "/advanced/code-highlighting",
            },
          ],
          "name": "advanced",
          "route": "/advanced",
        },
        {
          "children": [
            {
              "__pagePath": "features/i18n.mdx",
              "name": "i18n",
              "route": "/features/i18n",
            },
            {
              "__pagePath": "features/image.mdx",
              "name": "image",
              "route": "/features/image",
            },
            {
              "__pagePath": "features/latex.mdx",
              "name": "latex",
              "route": "/features/latex",
            },
            {
              "__pagePath": "features/mdx.mdx",
              "name": "mdx",
              "route": "/features/mdx",
            },
            {
              "__pagePath": "features/ssg.mdx",
              "name": "ssg",
              "route": "/features/ssg",
            },
            {
              "__pagePath": "features/themes.mdx",
              "name": "themes",
              "route": "/features/themes",
            },
            {
              "__metaPath": "features/_meta.js",
            },
          ],
          "name": "features",
          "route": "/features",
        },
        {
          "__pagePath": "get-started.mdx",
          "name": "get-started",
          "route": "/get-started",
        },
        {
          "__pagePath": "index.mdx",
          "name": "index",
          "route": "/",
        },
        {
          "children": [
            {
              "children": [
                {
                  "__pagePath": "themes/blog/index.mdx",
                  "name": "index",
                  "route": "/themes/blog",
                },
                {
                  "__metaPath": "themes/blog/_meta.js",
                },
              ],
              "name": "blog",
              "route": "/themes/blog",
            },
            {
              "children": [
                {
                  "__pagePath": "themes/docs/bleed.mdx",
                  "name": "bleed",
                  "route": "/themes/docs/bleed",
                },
                {
                  "__pagePath": "themes/docs/callout.mdx",
                  "name": "callout",
                  "route": "/themes/docs/callout",
                },
                {
                  "__pagePath": "themes/docs/configuration.mdx",
                  "name": "configuration",
                  "route": "/themes/docs/configuration",
                },
                {
                  "__pagePath": "themes/docs/index.mdx",
                  "name": "index",
                  "route": "/themes/docs",
                },
                {
                  "__pagePath": "themes/docs/tabs.mdx",
                  "name": "tabs",
                  "route": "/themes/docs/tabs",
                },
                {
                  "__metaPath": "themes/docs/_meta.js",
                },
              ],
              "name": "docs",
              "route": "/themes/docs",
            },
            {
              "__metaPath": "themes/_meta.js",
            },
          ],
          "name": "themes",
          "route": "/themes",
        },
        {
          "__metaPath": "_meta.js",
        },
      ]
    `)
  })
})
