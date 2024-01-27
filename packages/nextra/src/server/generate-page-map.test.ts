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
          "frontMatter": {},
          "name": "index",
          "route": "/",
        },
        {
          "children": [
            {
              "frontMatter": {},
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
            {
              "frontMatter": {},
              "name": "code-blocks",
              "route": "/posts/code-blocks",
            },
            {
              "frontMatter": {},
              "name": "draft",
              "route": "/posts/draft",
            },
            {
              "frontMatter": {},
              "name": "index",
              "route": "/posts",
            },
            {
              "frontMatter": {},
              "name": "nextra-components",
              "route": "/posts/nextra-components",
            },
            {
              "frontMatter": {},
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
              "frontMatter": {},
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
          "frontMatter": {},
          "name": "about",
          "route": "/about",
        },
        {
          "children": [
            {
              "children": [
                {
                  "frontMatter": {},
                  "name": "index",
                  "route": "/docs/blog-theme",
                },
                {
                  "frontMatter": {},
                  "name": "start",
                  "route": "/docs/blog-theme/start",
                },
              ],
              "name": "blog-theme",
              "route": "/docs/blog-theme",
            },
            {
              "frontMatter": {},
              "name": "custom-theme",
              "route": "/docs/custom-theme",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "frontMatter": {},
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
                      "frontMatter": {},
                      "name": "bleed",
                      "route": "/docs/docs-theme/built-ins/bleed",
                    },
                    {
                      "frontMatter": {},
                      "name": "index",
                      "route": "/docs/docs-theme/built-ins",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/docs-theme/built-ins",
                },
                {
                  "frontMatter": {},
                  "name": "index",
                  "route": "/docs/docs-theme",
                },
                {
                  "frontMatter": {},
                  "name": "page-configuration",
                  "route": "/docs/docs-theme/page-configuration",
                },
                {
                  "frontMatter": {},
                  "name": "start",
                  "route": "/docs/docs-theme/start",
                },
                {
                  "frontMatter": {},
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
                      "frontMatter": {},
                      "name": "index",
                      "route": "/docs/guide/advanced",
                    },
                    {
                      "frontMatter": {},
                      "name": "latex",
                      "route": "/docs/guide/advanced/latex",
                    },
                    {
                      "frontMatter": {},
                      "name": "mermaid",
                      "route": "/docs/guide/advanced/mermaid",
                    },
                    {
                      "frontMatter": {},
                      "name": "npm2yarn",
                      "route": "/docs/guide/advanced/npm2yarn",
                    },
                    {
                      "frontMatter": {},
                      "name": "remote",
                      "route": "/docs/guide/advanced/remote",
                    },
                    {
                      "frontMatter": {},
                      "name": "table",
                      "route": "/docs/guide/advanced/table",
                    },
                    {
                      "frontMatter": {},
                      "name": "tailwind-css",
                      "route": "/docs/guide/advanced/tailwind-css",
                    },
                    {
                      "frontMatter": {},
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
                      "frontMatter": {},
                      "name": "callout",
                      "route": "/docs/guide/built-ins/callout",
                    },
                    {
                      "frontMatter": {},
                      "name": "cards",
                      "route": "/docs/guide/built-ins/cards",
                    },
                    {
                      "frontMatter": {},
                      "name": "filetree",
                      "route": "/docs/guide/built-ins/filetree",
                    },
                    {
                      "frontMatter": {},
                      "name": "index",
                      "route": "/docs/guide/built-ins",
                    },
                    {
                      "frontMatter": {},
                      "name": "steps",
                      "route": "/docs/guide/built-ins/steps",
                    },
                    {
                      "frontMatter": {},
                      "name": "tabs",
                      "route": "/docs/guide/built-ins/tabs",
                    },
                  ],
                  "name": "built-ins",
                  "route": "/docs/guide/built-ins",
                },
                {
                  "frontMatter": {},
                  "name": "custom-css",
                  "route": "/docs/guide/custom-css",
                },
                {
                  "frontMatter": {},
                  "name": "i18n",
                  "route": "/docs/guide/i18n",
                },
                {
                  "frontMatter": {},
                  "name": "image",
                  "route": "/docs/guide/image",
                },
                {
                  "frontMatter": {},
                  "name": "index",
                  "route": "/docs/guide",
                },
                {
                  "frontMatter": {},
                  "name": "link",
                  "route": "/docs/guide/link",
                },
                {
                  "frontMatter": {},
                  "name": "markdown",
                  "route": "/docs/guide/markdown",
                },
                {
                  "frontMatter": {},
                  "name": "organize-files",
                  "route": "/docs/guide/organize-files",
                },
                {
                  "frontMatter": {},
                  "name": "ssg",
                  "route": "/docs/guide/ssg",
                },
                {
                  "frontMatter": {},
                  "name": "syntax-highlighting",
                  "route": "/docs/guide/syntax-highlighting",
                },
              ],
              "name": "guide",
              "route": "/docs/guide",
            },
            {
              "frontMatter": {},
              "name": "index",
              "route": "/docs",
            },
          ],
          "name": "docs",
          "route": "/docs",
        },
        {
          "frontMatter": {},
          "name": "index",
          "route": "/",
        },
        {
          "frontMatter": {},
          "name": "showcase",
          "route": "/showcase",
        },
      ]
    `)
  })
})
