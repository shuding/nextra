import path from 'node:path'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import { generatePageMapFromFilepaths, getFilepaths } from './generate-page-map'

describe('generatePageMapFromFilepaths()', () => {
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
  })
})
