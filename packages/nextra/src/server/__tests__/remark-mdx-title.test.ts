import { describe } from 'vitest'
import { clean } from '../../../__test__/test-utils.js'
import { compileMdx } from '../compile.js'

const opts = {
  filePath: 'foo/my-test-file.mdx',
  mdxOptions: {
    outputFormat: 'program',
    jsx: true
  }
} as const

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
      expect(clean(rawJs)).resolves.toMatch(`const title = '${title}'`)
    })

    it('esm', async () => {
      const title = 'From esm frontMatter'
      const rawJs = await compileMdx(
        `export const metadata = { title: '${title}' }

# Hello`,
        opts
      )
      expect(clean(rawJs)).resolves.toMatch(`const title = '${title}'`)
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
    expect(clean(rawJs)).resolves.toMatch("const title = 'h1 1'")
  })

  it('should fallback to capitalized filename', async () => {
    const rawJs = await compileMdx('', opts)
    expect(clean(rawJs)).resolves.toMatch("const title = 'My Test File'")
  })

  it('should set metadata.title if missing', async () => {
    const rawJs = await compileMdx('# should attach', opts)
    expect(clean(rawJs)).resolves.toMatch(`export const metadata = {
  filePath: 'foo/my-test-file.mdx',
  title: 'should attach'
}`)
  })
})
