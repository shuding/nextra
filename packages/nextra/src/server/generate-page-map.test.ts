import path from 'node:path'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import { generatePageMapFromFilepaths, getFilepaths } from './generate-page-map'

describe('generatePageMapFromFilepaths()', () => {
  it('should work for blog example', async() => {
    const cwd = path.join(process.cwd(), '..', '..', 'examples', 'blog')
    const { appDir } = findPagesDir(cwd)

    const pagePaths = await getFilepaths({ appDir, cwd })
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
    expect(generatePageMapFromFilepaths(pagePaths)).toMatchInlineSnapshot(`
      [
        {
          "name": "index",
          "route": "/",
        },
        {
          "children": [
            {
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
            {
              "name": "code-blocks",
              "route": "/posts/code-blocks",
            },
            {
              "name": "draft",
              "route": "/posts/draft",
            },
            {
              "name": "index",
              "route": "/posts",
            },
            {
              "name": "nextra-components",
              "route": "/posts/nextra-components",
            },
            {
              "name": "table",
              "route": "/posts/table",
            },
          ],
          "name": "posts",
          "route": "/posts",
        },
        {
          "name": "tags",
          "route": "/tags",
        },
      ]
    `)
  })

  it('should work', async () => {
    const cwd = path.join(process.cwd(), '..', '..', 'docs')
    const { appDir } = findPagesDir(cwd)

    const pagePaths = await getFilepaths({ appDir, cwd })
    expect(pagePaths.sort((a, b) => a.localeCompare(b))).toMatchInlineSnapshot(`
      [
        "about/page.mdx",
        "docs/blog-theme/page.mdx",
        "docs/blog-theme/start/page.mdx",
        "docs/custom-theme/page.mdx",
        "docs/docs-theme/api/use-config/page.mdx",
        "docs/docs-theme/built-ins/bleed/page.mdx",
        "docs/docs-theme/built-ins/page.mdx",
        "docs/docs-theme/page-configuration/page.mdx",
        "docs/docs-theme/page.mdx",
        "docs/docs-theme/start/page.mdx",
        "docs/docs-theme/theme-configuration/page.mdx",
        "docs/guide/advanced/latex/page.mdx",
        "docs/guide/advanced/mermaid/page.mdx",
        "docs/guide/advanced/npm2yarn/page.mdx",
        "docs/guide/advanced/page.mdx",
        "docs/guide/advanced/remote/page.mdx",
        "docs/guide/advanced/table/page.mdx",
        "docs/guide/advanced/tailwind-css/page.mdx",
        "docs/guide/advanced/typescript/page.mdx",
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
        "docs/page.mdx",
        "page.tsx",
        "showcase/page.mdx",
      ]
    `)

    expect(generatePageMapFromFilepaths(pagePaths)).toMatchInlineSnapshot(`
      [
        {
          "name": "about",
          "route": "/about",
        },
        {
          "children": [
            {
              "children": [
                {
                  "name": "index",
                  "route": "/docs/blog-theme",
                },
                {
                  "name": "start",
                  "route": "/docs/blog-theme/start",
                },
              ],
              "name": "blog-theme",
              "route": "/docs/blog-theme",
            },
            {
              "name": "custom-theme",
              "route": "/docs/custom-theme",
            },
            {
              "children": [
                {
                  "name": "api",
                  "route": "/docs/docs-theme/api",
                },
                {
                  "children": [
                    {
                      "name": "bleed",
                      "route": "/docs/docs-theme/built-ins/bleed",
                    },
                    {
                      "name": "index",
                      "route": "/docs/docs-theme/built-ins",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/docs-theme/built-ins",
                },
                {
                  "name": "index",
                  "route": "/docs/docs-theme",
                },
                {
                  "name": "page-configuration",
                  "route": "/docs/docs-theme/page-configuration",
                },
                {
                  "name": "start",
                  "route": "/docs/docs-theme/start",
                },
                {
                  "name": "theme-configuration",
                  "route": "/docs/docs-theme/theme-configuration",
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
                      "name": "index",
                      "route": "/docs/guide/advanced",
                    },
                    {
                      "name": "latex",
                      "route": "/docs/guide/advanced/latex",
                    },
                    {
                      "name": "mermaid",
                      "route": "/docs/guide/advanced/mermaid",
                    },
                    {
                      "name": "npm2yarn",
                      "route": "/docs/guide/advanced/npm2yarn",
                    },
                    {
                      "name": "remote",
                      "route": "/docs/guide/advanced/remote",
                    },
                    {
                      "name": "table",
                      "route": "/docs/guide/advanced/table",
                    },
                    {
                      "name": "tailwind-css",
                      "route": "/docs/guide/advanced/tailwind-css",
                    },
                    {
                      "name": "typescript",
                      "route": "/docs/guide/advanced/typescript",
                    },
                  ],
                  "name": "advanced",
                  "route": "/docs/guide/advanced",
                },
                {
                  "children": [
                    {
                      "name": "callout",
                      "route": "/docs/guide/built-ins/callout",
                    },
                    {
                      "name": "cards",
                      "route": "/docs/guide/built-ins/cards",
                    },
                    {
                      "name": "filetree",
                      "route": "/docs/guide/built-ins/filetree",
                    },
                    {
                      "name": "index",
                      "route": "/docs/guide/built-ins",
                    },
                    {
                      "name": "steps",
                      "route": "/docs/guide/built-ins/steps",
                    },
                    {
                      "name": "tabs",
                      "route": "/docs/guide/built-ins/tabs",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/guide/built-ins",
                },
                {
                  "name": "custom-css",
                  "route": "/docs/guide/custom-css",
                },
                {
                  "name": "i18n",
                  "route": "/docs/guide/i18n",
                },
                {
                  "name": "image",
                  "route": "/docs/guide/image",
                },
                {
                  "name": "index",
                  "route": "/docs/guide",
                },
                {
                  "name": "link",
                  "route": "/docs/guide/link",
                },
                {
                  "name": "markdown",
                  "route": "/docs/guide/markdown",
                },
                {
                  "name": "organize-files",
                  "route": "/docs/guide/organize-files",
                },
                {
                  "name": "ssg",
                  "route": "/docs/guide/ssg",
                },
                {
                  "name": "syntax-highlighting",
                  "route": "/docs/guide/syntax-highlighting",
                },
              ],
              "name": "guide",
              "route": "/docs/guide",
            },
            {
              "name": "index",
              "route": "/docs",
            },
          ],
          "name": "docs",
          "route": "/docs",
        },
        {
          "name": "index",
          "route": "/",
        },
        {
          "name": "showcase",
          "route": "/showcase",
        },
      ]
    `)
  })
})
