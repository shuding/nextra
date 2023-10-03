import { compileMdx } from '../../compile.js'
import { clean } from '../../../../__test__/test-utils.js'

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
          jsx: true,
        }
      }
    )
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { createElement } from 'react'
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      export const frontMatter = {
        title: 'From frontMatter'
      }
      export function useTOC(props) {
        return []
      }
      function _createMdxContent(props) {
        const _components = Object.assign(
          {
            h1: 'h1'
          },
          _provideComponents(),
          props.components
        )
        return <_components.h1>{'Hello'}</_components.h1>
      }
      "
    `)
  })
})
