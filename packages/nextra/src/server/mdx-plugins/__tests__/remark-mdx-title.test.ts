import { clean } from '../../../../__test__/test-utils.js'
import { compileMdx } from '../../compile.js'

describe('remarkMdxTitle', () => {
  it('should work', async () => {
    const { result } = await compileMdx(
      `---
title: From frontMatter
---

# Hello`,
      {
        mdxOptions: {
          outputFormat: 'program',
          jsx: true
        }
      }
    )
    expect(clean(result.replace(/function _createMdxContent.+/s, ''))).resolves
      .toMatchInlineSnapshot(`
      "import { createElement } from 'react'
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      export const title = 'From frontMatter'
      export const frontMatter = {
        title: 'From frontMatter'
      }
      export function useTOC(props) {
        return []
      }
      "
    `)
  })
})
