import { compileMdx } from '../src/server/compile.js'
import { clean } from './test-utils.js'

const mdxOptions = {
  jsx: true,
  outputFormat: 'program'
} as const

describe('Compile', () => {
  it('should work with export default', async () => {
    const rawJs = await compileMdx(
      `import foo from './foo'
      
## heading

export default foo`,
      { mdxOptions }
    )
    expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      export const title = ''
      export const metadata = {}
      import foo from './foo'
      const MDXLayout = foo
      export function useTOC(props) {
        return [
          {
            value: 'heading',
            id: 'heading',
            depth: 2
          }
        ]
      }
      "
    `)
  })
  it('should work with export as default', async () => {
    const rawJs = await compileMdx(
      `## heading
      
export { foo as default } from './foo'`,
      { mdxOptions }
    )
    expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      export const title = ''
      export const metadata = {}
      import { foo as MDXLayout } from './foo'
      export function useTOC(props) {
        return [
          {
            value: 'heading',
            id: 'heading',
            depth: 2
          }
        ]
      }
      "
    `)
  })
})

describe('Process heading', () => {
  it('code-h1', async () => {
    const rawJs = await compileMdx('# `codegen.yml`', { mdxOptions })
    expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('code-with-text-h1', async () => {
    const rawJs = await compileMdx('# `codegen.yml` file', { mdxOptions })
    expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('static-h1', async () => {
    const rawJs = await compileMdx('# Hello World', { mdxOptions })
    expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('dynamic-h1', async () => {
    const rawJs = await compileMdx(
      `
import { useRouter } from 'next/router'

export const TagName = () => {
  const { tag } = useRouter().query
  return tag || null
}

# Posts Tagged with "<TagName/>"
    `,
      { mdxOptions }
    )
    expect(await clean(rawJs)).toMatchSnapshot()
  })
  it('no-h1', async () => {
    const rawJs = await compileMdx('## H2', { mdxOptions })
    expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('use custom heading id', async () => {
    const rawJs = await compileMdx(
      `
# My Header [#test-id]
## Some extra space [#extra-space]&nbsp;
### Some extra space in heading    [#extra-space-in-heading]
### nospace[#without-space]
#### foo [#другой язык]
##### bar Baz []
###### bar Qux [#]`,
      { mdxOptions }
    )
    expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      export const title = 'My Header'
      export const metadata = {
        title: 'My Header'
      }
      export function useTOC(props) {
        return [
          {
            value: 'Some extra space',
            id: 'extra-space',
            depth: 2
          },
          {
            value: 'Some extra space in heading',
            id: 'extra-space-in-heading',
            depth: 3
          },
          {
            value: 'nospace',
            id: 'without-space',
            depth: 3
          },
          {
            value: 'foo',
            id: 'другой-язык',
            depth: 4
          },
          {
            value: 'bar Baz []',
            id: 'bar-baz-',
            depth: 5
          },
          {
            value: 'bar Qux [#]',
            id: 'bar-qux-',
            depth: 6
          }
        ]
      }
      function MDXLayout(props) {
        const { toc = useTOC(props) } = props
        const _components = {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          ...props.components
        }
        return (
          <>
            <_components.h1 id="test-id">{'My Header'}</_components.h1>
            {'\\n'}
            <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
            {'\\n'}
            <_components.h3 id={toc[1].id}>{toc[1].value}</_components.h3>
            {'\\n'}
            <_components.h3 id={toc[2].id}>{toc[2].value}</_components.h3>
            {'\\n'}
            <_components.h4 id={toc[3].id}>{toc[3].value}</_components.h4>
            {'\\n'}
            <_components.h5 id={toc[4].id}>{toc[4].value}</_components.h5>
            {'\\n'}
            <_components.h6 id={toc[5].id}>{toc[5].value}</_components.h6>
          </>
        )
      }
      "
    `)
  })
  it('use github-slugger', async () => {
    const rawJs = await compileMdx('### My Header', { mdxOptions })
    expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      export const title = ''
      export const metadata = {}
      export function useTOC(props) {
        return [
          {
            value: 'My Header',
            id: 'my-header',
            depth: 3
          }
        ]
      }
      function MDXLayout(props) {
        const { toc = useTOC(props) } = props
        const _components = {
          h3: 'h3',
          ...props.components
        }
        return <_components.h3 id={toc[0].id}>{toc[0].value}</_components.h3>
      }
      "
    `)
  })

  it('should merge headings from partial components', async () => {
    const rawJs = await compileMdx(
      `
import FromMdx from './one.mdx'
import FromMarkdown from './two.md'
import IgnoreMe from './foo'

## ❤️

<FromMdx />

## ✅

<FromMarkdown />

import Last from './three.mdx'

<Last />

<IgnoreMe />

## 👋

## kek <Kek />

## \`try\` me

## latex $l$

## {'interpolate'} {1} {true} {null} {variable}

`,
      { mdxOptions, latex: true }
    )
    expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      export const title = ''
      export const metadata = {}
      import FromMdx, { useTOC as useTOC0 } from './one.mdx'
      import FromMarkdown, { useTOC as useTOC1 } from './two.md'
      import IgnoreMe from './foo'
      import Last, { useTOC as useTOC2 } from './three.mdx'
      export function useTOC(props) {
        return [
          {
            value: '❤️',
            id: '️',
            depth: 2
          },
          ...useTOC0(),
          {
            value: '✅',
            id: '',
            depth: 2
          },
          ...useTOC1(),
          ...useTOC2(),
          {
            value: '👋',
            id: '-1',
            depth: 2
          },
          {
            value: (
              <>
                {'kek '}
                <Kek />
              </>
            ),
            id: 'kek-',
            depth: 2
          },
          {
            value: (
              <>
                <code>{'try'}</code>
                {' me'}
              </>
            ),
            id: 'try-me',
            depth: 2
          },
          {
            value: (
              <>
                {'latex '}
                <span className="katex">
                  <span className="katex-mathml">
                    <math xmlns="http://www.w3.org/1998/Math/MathML">
                      <semantics>
                        <mrow>
                          <mi>{'l'}</mi>
                        </mrow>
                        <annotation encoding="application/x-tex">{'l'}</annotation>
                      </semantics>
                    </math>
                  </span>
                  <span className="katex-html" aria-hidden="true">
                    <span className="base">
                      <span
                        className="strut"
                        style={{
                          height: '0.6944em'
                        }}
                      />
                      <span
                        className="mord mathnormal"
                        style={{
                          marginRight: '0.01968em'
                        }}
                      >
                        {'l'}
                      </span>
                    </span>
                  </span>
                </span>
              </>
            ),
            id: 'latex-l',
            depth: 2
          },
          {
            value: (
              <>
                {'interpolate'} {1} {true} {null} {variable}
              </>
            ),
            id: 'interpolate-1-true-null-variable',
            depth: 2
          }
        ]
      }
      function MDXLayout(props) {
        const { toc = useTOC(props) } = props
        const _components = {
          h2: 'h2',
          ...props.components
        }
        return (
          <>
            <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
            {'\\n'}
            <FromMdx />
            {'\\n'}
            <_components.h2 id={toc[1].id}>{toc[1].value}</_components.h2>
            {'\\n'}
            <FromMarkdown />
            {'\\n'}
            {'\\n'}
            <Last />
            {'\\n'}
            <IgnoreMe />
            {'\\n'}
            <_components.h2 id={toc[2].id}>{toc[2].value}</_components.h2>
            {'\\n'}
            <_components.h2 id={toc[3].id}>{toc[3].value}</_components.h2>
            {'\\n'}
            <_components.h2 id={toc[4].id}>{toc[4].value}</_components.h2>
            {'\\n'}
            <_components.h2 id={toc[5].id}>{toc[5].value}</_components.h2>
            {'\\n'}
            <_components.h2 id={toc[6].id}>{toc[6].value}</_components.h2>
          </>
        )
      }
      "
    `)
  })
  it('should not attach headings with parent Tab or Tabs.Tab', async () => {
    const rawJs = await compileMdx(
      `
<Tab>
 ## foo
</Tab>

<Tabs.Tab>
  ## bar
  ## baz [#custom-id]
</Tabs.Tab>
`,
      { mdxOptions }
    )
    expect(rawJs).toMatch(`export function useTOC(props) {
  return [];
}`)
    expect(rawJs).not.toMatch('id=')
  })
})

describe('Link', () => {
  it('supports .md links', async () => {
    const rawJs = await compileMdx('[link](../file.md)', { mdxOptions })
    expect(rawJs).toMatch('<_components.a href="../file">')
  })

  it('supports .mdx links', async () => {
    const rawJs = await compileMdx('[link](../file.mdx)', { mdxOptions })
    expect(rawJs).toMatch('<_components.a href="../file">')
  })

  it('supports URL links', async () => {
    const rawJs = await compileMdx('[link](../file)', { mdxOptions })
    expect(rawJs).toMatch('<_components.a href="../file">')
  })

  it('supports query', async () => {
    const rawJs = await compileMdx('[link](../file.md?query=a)', {
      mdxOptions
    })
    expect(rawJs).toMatch('<_components.a href="../file?query=a">')
  })

  it('supports anchor', async () => {
    const rawJs = await compileMdx('[link](../file.md#anchor)', {
      mdxOptions
    })
    expect(rawJs).toMatch('<_components.a href="../file#anchor">')
  })

  it('supports external .md links', async () => {
    const rawJs = await compileMdx('[link](https://example.com/file.md)', {
      mdxOptions
    })
    expect(rawJs).toMatch('<_components.a href="https://example.com/file.md">')
  })

  it('supports external .mdx links', async () => {
    const rawJs = await compileMdx(
      '[link](https://example.com/file.mdx)',
      { mdxOptions }
    )
    expect(rawJs).toMatch(
      '<_components.a href="https://example.com/file.mdx">'
    )
  })
})

describe('Code block', () => {
  describe('Filename', () => {
    it('attach with "codeHighlight: true" by default', async () => {
      const rawJs = await compileMdx('```text filename="test.js"\n```', {
        mdxOptions,
        search: true
      })
      expect(rawJs).toMatch(
        '<_components.pre tabIndex="0" data-language="text" data-word-wrap="" data-filename="test.js">'
      )
    })

    it('attach with "codeHighlight: false"', async () => {
      const rawJs = await compileMdx('```js filename="test.js"\n```', {
        mdxOptions,
        codeHighlight: false
      })
      expect(rawJs).toMatch(
        '<_components.pre data-filename="test.js" data-word-wrap="">'
      )
    })

    it('not highlight filename as substring', async () => {
      const rawJs = await compileMdx('```js filename="/foo/"\nfoo\n```', {
        mdxOptions,
        codeHighlight: true // processed only by rehype-pretty-code
      })
      expect(rawJs).not.toMatch(
        'className="highlighted">{"foo"}</_components.span>'
      )
      expect(rawJs).toMatch('}}>{"foo"}</_components.span>')
    })
  })

  describe('Highlight', () => {
    it('should support line highlights', async () => {
      const rawJs = await compileMdx(
        '```js filename="test.js" {1}\n123\n```',
        { mdxOptions }
      )
      expect(rawJs).toMatch('<_components.span data-highlighted-line="">')
    })
  })

  describe('Copy code button', () => {
    for (const codeHighlight of [true, false]) {
      describe(`codeHighlight: ${codeHighlight}`, () => {
        it('attach with "copy"', async () => {
          const rawJs = await compileMdx('```js copy\n```', {
            mdxOptions,
            codeHighlight,
            search: true
          })
          expect(rawJs).toMatch('data-word-wrap="" data-copy="">')
        })

        it('attach with "defaultShowCopyCode: true"', async () => {
          const rawJs = await compileMdx('```js\n```', {
            mdxOptions,
            defaultShowCopyCode: true,
            codeHighlight,
            search: true
          })
          expect(rawJs).toMatch('data-word-wrap="" data-copy="">')
        })

        it('not attach with "defaultShowCopyCode: true" and "copy=false"', async () => {
          const rawJs = await compileMdx('```js copy=false\n```', {
            mdxOptions,
            defaultShowCopyCode: true,
            codeHighlight
          })
          expect(rawJs).not.toMatch('data-copy=""')
        })
      })
    }
  })
})
