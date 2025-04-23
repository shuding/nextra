import { compileMdx } from '../compile.js'
import { clean } from './test-utils.js'

const mdxOptions = {
  jsx: true,
  outputFormat: 'program' as const
}

describe('Compile', () => {
  it('should work with export default', async () => {
    const rawJs = await compileMdx(
      `import foo from './foo'
      
## heading

export default foo`,
      { mdxOptions }
    )
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { HOC_MDXWrapper } from 'nextra/setup-page'
      import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
      export const metadata = {}
      import foo from './foo'
      const MDXLayout = foo
      function useTOC(props) {
        return [
          {
            value: 'heading',
            id: 'heading',
            depth: 2
          }
        ]
      }
      export const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
          h2: 'h2',
          ..._provideComponents(),
          ...props.components
        }
        return <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
      }
      function MDXContent(props = {}) {
        return (
          <MDXLayout {...props}>
            <_createMdxContent {...props} />
          </MDXLayout>
        )
      }
      export default HOC_MDXWrapper(MDXContent, {
        metadata,
        toc
      })"
    `)
  })
  it('should work with export as default', async () => {
    const rawJs = await compileMdx(
      `## heading
      
export { foo as default } from './foo'`,
      { mdxOptions }
    )
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
      export const metadata = {}
      import { foo as MDXLayout } from './foo'
      function useTOC(props) {
        return [
          {
            value: 'heading',
            id: 'heading',
            depth: 2
          }
        ]
      }
      export const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
          h2: 'h2',
          ..._provideComponents(),
          ...props.components
        }
        return <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
      }
      export default _createMdxContent"
    `)
  })
})

describe('Process heading', () => {
  it('code-h1', async () => {
    const rawJs = await compileMdx('# `codegen.yml`', { mdxOptions })
    return expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('code-with-text-h1', async () => {
    const rawJs = await compileMdx('# `codegen.yml` file', { mdxOptions })
    return expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('static-h1', async () => {
    const rawJs = await compileMdx('# Hello World', { mdxOptions })
    return expect(clean(rawJs)).resolves.toMatchSnapshot()
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
    return expect(clean(rawJs)).resolves.toMatchSnapshot()
  })
  it('no-h1', async () => {
    const rawJs = await compileMdx('## H2', { mdxOptions })
    return expect(clean(rawJs)).resolves.toMatchSnapshot()
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
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
      export const metadata = {
        title: 'My Header'
      }
      function useTOC(props) {
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
      export const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          ..._provideComponents(),
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
      export default _createMdxContent"
    `)
  })
  it('use github-slugger', async () => {
    const rawJs = await compileMdx('### My Header', { mdxOptions })
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
      export const metadata = {}
      function useTOC(props) {
        return [
          {
            value: 'My Header',
            id: 'my-header',
            depth: 3
          }
        ]
      }
      export const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
          h3: 'h3',
          ..._provideComponents(),
          ...props.components
        }
        return <_components.h3 id={toc[0].id}>{toc[0].value}</_components.h3>
      }
      export default _createMdxContent"
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
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
      export const metadata = {}
      import FromMdx, { toc as toc0 } from './one.mdx'
      import FromMarkdown, { toc as toc1 } from './two.md'
      import IgnoreMe from './foo'
      import Last, { toc as toc2 } from './three.mdx'
      function useTOC(props) {
        const _components = {
            annotation: 'annotation',
            code: 'code',
            math: 'math',
            mi: 'mi',
            mrow: 'mrow',
            semantics: 'semantics',
            span: 'span',
            ..._provideComponents()
          },
          { Kek } = _components
        if (!Kek) _missingMdxReference('Kek', true)
        return [
          {
            value: '❤️',
            id: '️',
            depth: 2
          },
          ...toc0,
          {
            value: '✅',
            id: '',
            depth: 2
          },
          ...toc1,
          ...toc2,
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
                <_components.code>{'try'}</_components.code>
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
                <_components.span className="katex">
                  <_components.span className="katex-mathml">
                    <_components.math xmlns="http://www.w3.org/1998/Math/MathML">
                      <_components.semantics>
                        <_components.mrow>
                          <_components.mi>{'l'}</_components.mi>
                        </_components.mrow>
                        <_components.annotation encoding="application/x-tex">{'l'}</_components.annotation>
                      </_components.semantics>
                    </_components.math>
                  </_components.span>
                  <_components.span className="katex-html" aria-hidden="true">
                    <_components.span className="base">
                      <_components.span
                        className="strut"
                        style={{
                          height: '0.6944em'
                        }}
                      />
                      <_components.span
                        className="mord mathnormal"
                        style={{
                          marginRight: '0.01968em'
                        }}
                      >
                        {'l'}
                      </_components.span>
                    </_components.span>
                  </_components.span>
                </_components.span>
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
      export const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
            annotation: 'annotation',
            code: 'code',
            h2: 'h2',
            math: 'math',
            mi: 'mi',
            mrow: 'mrow',
            semantics: 'semantics',
            span: 'span',
            ..._provideComponents(),
            ...props.components
          },
          { Kek } = _components
        if (!Kek) _missingMdxReference('Kek', true)
        return (
          <>
            <_components.h2 id="️">{'❤️'}</_components.h2>
            {'\\n'}
            <FromMdx />
            {'\\n'}
            <_components.h2 id="">{'✅'}</_components.h2>
            {'\\n'}
            <FromMarkdown />
            {'\\n'}
            {'\\n'}
            <Last />
            {'\\n'}
            <IgnoreMe />
            {'\\n'}
            <_components.h2 id="-1">{'👋'}</_components.h2>
            {'\\n'}
            <_components.h2 id="kek-">
              {'kek '}
              <Kek />
            </_components.h2>
            {'\\n'}
            <_components.h2 id="try-me">
              <_components.code>{'try'}</_components.code>
              {' me'}
            </_components.h2>
            {'\\n'}
            <_components.h2 id="latex-l">
              {'latex '}
              <_components.span className="katex">
                <_components.span className="katex-mathml">
                  <_components.math xmlns="http://www.w3.org/1998/Math/MathML">
                    <_components.semantics>
                      <_components.mrow>
                        <_components.mi>{'l'}</_components.mi>
                      </_components.mrow>
                      <_components.annotation encoding="application/x-tex">{'l'}</_components.annotation>
                    </_components.semantics>
                  </_components.math>
                </_components.span>
                <_components.span className="katex-html" aria-hidden="true">
                  <_components.span className="base">
                    <_components.span
                      className="strut"
                      style={{
                        height: '0.6944em'
                      }}
                    />
                    <_components.span
                      className="mord mathnormal"
                      style={{
                        marginRight: '0.01968em'
                      }}
                    >
                      {'l'}
                    </_components.span>
                  </_components.span>
                </_components.span>
              </_components.span>
            </_components.h2>
            {'\\n'}
            <_components.h2 id="interpolate-1-true-null-variable">
              {'interpolate'} {1} {true} {null} {variable}
            </_components.h2>
          </>
        )
      }
      export default _createMdxContent
      function _missingMdxReference(id, component) {
        throw new Error(
          'Expected ' +
            (component ? 'component' : 'object') +
            ' \`' +
            id +
            '\` to be defined: you likely forgot to import, pass, or provide it.'
        )
      }"
    `)
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
    const rawJs = await compileMdx('[link](https://example.com/file.mdx)', {
      mdxOptions
    })
    expect(rawJs).toMatch('<_components.a href="https://example.com/file.mdx">')
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
      const rawJs = await compileMdx('```js filename="test.js" {1}\n123\n```', {
        mdxOptions
      })
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

  describe('toc', () => {
    it('should attach heading', async () => {
      const rawMdx = `<Tabs items={['pnpm', 'npm', 'yarn']} defaultIndex="1">
  <Tabs.Tab>**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
  <Tabs.Tab>**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
  <Tabs.Tab>**Yarn** is a software packaging system.</Tabs.Tab>
</Tabs>
`
      const rawJs = await compileMdx(rawMdx + rawMdx, {
        mdxOptions
      })
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {}
        function useTOC(props) {
          return []
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
              strong: 'strong',
              ..._provideComponents(),
              ...props.components
            },
            { Tabs } = _components
          if (!Tabs) _missingMdxReference('Tabs', true)
          if (!Tabs.Tab) _missingMdxReference('Tabs.Tab', true)
          return (
            <>
              <Tabs items={['pnpm', 'npm', 'yarn']} defaultIndex="1">
                <Tabs.Tab>
                  <h3
                    id="pnpm"
                    style={{
                      visibility: 'hidden',
                      width: 0,
                      height: 0
                    }}
                  >
                    {'pnpm'}
                  </h3>
                  <_components.strong>{'pnpm'}</_components.strong>
                  {': Fast, disk space efficient package manager.'}
                </Tabs.Tab>
                <Tabs.Tab>
                  <h3
                    id="npm"
                    style={{
                      visibility: 'hidden',
                      width: 0,
                      height: 0
                    }}
                  >
                    {'npm'}
                  </h3>
                  <_components.strong>{'npm'}</_components.strong>
                  {' is a package manager for the JavaScript programming language.'}
                </Tabs.Tab>
                <Tabs.Tab>
                  <h3
                    id="yarn"
                    style={{
                      visibility: 'hidden',
                      width: 0,
                      height: 0
                    }}
                  >
                    {'yarn'}
                  </h3>
                  <_components.strong>{'Yarn'}</_components.strong>
                  {' is a software packaging system.'}
                </Tabs.Tab>
              </Tabs>
              {'\\n'}
              <Tabs items={['pnpm', 'npm', 'yarn']} defaultIndex="1">
                <Tabs.Tab>
                  <h3
                    id="pnpm-1"
                    style={{
                      visibility: 'hidden',
                      width: 0,
                      height: 0
                    }}
                  >
                    {'pnpm'}
                  </h3>
                  <_components.strong>{'pnpm'}</_components.strong>
                  {': Fast, disk space efficient package manager.'}
                </Tabs.Tab>
                <Tabs.Tab>
                  <h3
                    id="npm-1"
                    style={{
                      visibility: 'hidden',
                      width: 0,
                      height: 0
                    }}
                  >
                    {'npm'}
                  </h3>
                  <_components.strong>{'npm'}</_components.strong>
                  {' is a package manager for the JavaScript programming language.'}
                </Tabs.Tab>
                <Tabs.Tab>
                  <h3
                    id="yarn-1"
                    style={{
                      visibility: 'hidden',
                      width: 0,
                      height: 0
                    }}
                  >
                    {'yarn'}
                  </h3>
                  <_components.strong>{'Yarn'}</_components.strong>
                  {' is a software packaging system.'}
                </Tabs.Tab>
              </Tabs>
            </>
          )
        }
        export default _createMdxContent
        function _missingMdxReference(id, component) {
          throw new Error(
            'Expected ' +
              (component ? 'component' : 'object') +
              ' \`' +
              id +
              '\` to be defined: you likely forgot to import, pass, or provide it.'
          )
        }"
      `)
    })
  })

  it('should attach id to summary', async () => {
    const rawMdx = `
<details>
  <summary>foo</summary>
  bar
</details>
<details>
  <summary>foo</summary>
  bar
</details>
`
    const rawJs = await compileMdx(rawMdx, { mdxOptions })
    return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
      export const metadata = {}
      function useTOC(props) {
        return []
      }
      export const toc = useTOC({})
      function _createMdxContent(props) {
        const _components = {
          details: 'details',
          p: 'p',
          summary: 'summary',
          ..._provideComponents(),
          ...props.components
        }
        return (
          <>
            <_components.details>
              <_components.p>
                <_components.summary id="foo">{'foo'}</_components.summary>
                {'\\nbar'}
              </_components.p>
            </_components.details>
            {'\\n'}
            <_components.details>
              <_components.p>
                <_components.summary id="foo-1">{'foo'}</_components.summary>
                {'\\nbar'}
              </_components.p>
            </_components.details>
          </>
        )
      }
      export default _createMdxContent"
    `)
  })
})
