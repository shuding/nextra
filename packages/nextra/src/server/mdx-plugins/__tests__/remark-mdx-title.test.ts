import { clean } from '../../../../__test__/test-utils.js'
import { compileMdx } from '../../compile.js'

const opts = {
  filePath: '/foo/my-test-file.mdx',
  mdxOptions: {
    outputFormat: 'program',
    jsx: true
  },
} as const

describe('remarkMdxTitle', () => {
  it('should take priority of yaml frontmatter', async () => {
    const title = 'From yaml frontMatter'
    const { result } = await compileMdx(
      `---
title: ${title}
---

# Hello`,
      opts
    )
    expect(clean(result)).resolves.toMatch(`export const title = '${title}'`)
  })

  it('should take priority of esm frontmatter', async () => {
    const title = 'From esm frontMatter'
    const { result } = await compileMdx(
      `export const frontMatter = { title: '${title}' }

# Hello`,
      opts
    )
    expect(clean(result)).resolves.toMatch(`export const title = '${title}'`)
  })

  it('should fallback to first h1', async () => {
    const { result } = await compileMdx(
      `## h2
# h1 1
# h1 2
`,
      opts
    )
    expect(clean(result)).resolves.toMatch("export const title = 'h1 1'")
  })

  it('should fallback to capitalized filename', async () => {
    const { result } = await compileMdx('', opts)
    expect(clean(result)).resolves.toMatch(
      "export const title = 'My Test File'"
    )
  })
})
