import { clean } from '../../../__test__/test-utils.js'
import { compileMdx } from '../compile.js'

const opts = {
  mdxOptions: { jsx: true }
} as const

describe('remarkRemoveImports', () => {
  it('should fill heading deeply', async () => {
    const rawJs = await compileMdx(
      `
import { Steps } from 'nextra/components'

export const myVar = 123

export const Test = ({value}) => value

## <Test value="Hello" /> {myVar}
`,
      opts
    )
    expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      'use strict'
      const metadata = {}
      const myVar = 123
      const Test = ({ value }) => value
      const toc = [
        {
          value: (
            <>
              <Test value="Hello" /> {myVar}
            </>
          ),
          id: '-myvar',
          depth: 2
        }
      ]
      function _createMdxContent(props) {
        const _components = {
          h2: 'h2',
          ...props.components
        }
        return (
          <_components.h2 id="-myvar">
            <Test value="Hello" /> {myVar}
          </_components.h2>
        )
      }
      return {
        metadata,
        myVar,
        Test,
        toc,
        default: _createMdxContent
      }
      "
    `)
  })
})
