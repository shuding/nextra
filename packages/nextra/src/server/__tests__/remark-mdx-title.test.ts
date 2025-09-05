import { compileMdx } from '../compile.js'
import { clean } from './test-utils.js'

const opts = {
  filePath: 'foo/my-test-file.mdx'
}

describe('remarkMdxTitle', () => {
  describe('should prioritize frontmatter', () => {
    it('yaml', async () => {
      const title = 'From yaml frontMatter'
      const rawJs = await compileMdx(
        `---
title: ${title}
---

# Hello`,
        opts
      )
      return expect(clean(rawJs)).resolves.toMatch(`title: '${title}',`)
    })

    it('esm', async () => {
      const title = 'From esm frontMatter'
      const rawJs = await compileMdx(
        `export const metadata = { title: '${title}' }

# Hello`,
        opts
      )
      return expect(clean(rawJs)).resolves.toMatch(`title: '${title}',`)
    })
  })

  it('should fallback to first h1', async () => {
    const rawJs = await compileMdx(
      `## h2
# h1 1
# h1 2
`,
      opts
    )
    return expect(clean(rawJs)).resolves.toMatch("title: 'h1 1',")
  })

  it('should fallback to capitalized filename', async () => {
    const rawJs = await compileMdx('', opts)
    return expect(clean(rawJs)).resolves.toMatch("title: 'My Test File',")
  })

  it('should not set `metadata.title` if there is no h1 or filename provided', async () => {
    const rawJs = await compileMdx('')
    return expect(clean(rawJs)).resolves.toMatch('const metadata = {}')
  })
})
