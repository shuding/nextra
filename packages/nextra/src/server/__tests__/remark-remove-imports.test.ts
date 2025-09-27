import { compileMdx } from '../compile.js'
import { clean } from './test-utils.js'

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
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      'use strict'
      const { useMDXComponents: _provideComponents } = arguments[0]
      const metadata = {}
      const myVar = 123
      const Test = ({ value }) => value
      function useTOC(props) {
        return [
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
      }
      const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
          h2: 'h2',
          ..._provideComponents(),
          ...props.components
        }
        return <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
      }
      return {
        metadata,
        myVar,
        Test,
        toc,
        default: _createMdxContent
      }"
    `)
  })
})
