import { compileMdx } from '../../compile.js'
import { clean } from '../../../../__test__/test-utils.js'

describe('remarkMdxTitle', () => {
  it('should work', async () => {
    const { result } = await compileMdx(
      `
---
title: From frontMatter
---

# Hello
`,
      {
        mdxOptions: {
          outputFormat: 'program',
          jsx: true,
        }
      }
    )
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
      const { useMDXComponents: _provideComponents } = arguments[0]
      const frontMatter = {}
      function useTOC(props) {
        return [
          {
            value: 'title: From frontMatter',
            id: 'title-from-frontmatter',
            depth: 2
          }
        ]
      }
      function _createMdxContent(props) {
        const _components = Object.assign(
          {
            hr: 'hr',
            h2: 'h2',
            h1: 'h1'
          },
          _provideComponents(),
          props.components
        )
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.hr, {}),
            '\\\\n',
            _jsx(_components.h2, {
              id: 'title-from-frontmatter',
              children: 'title: From frontMatter'
            }),
            '\\\\n',
            _jsx(_components.h1, {
              children: 'Hello'
            })
          ]
        })
      }
      return {
        frontMatter,
        useTOC,
        default: _createMdxContent
      }
      "
    `)
  })
})
