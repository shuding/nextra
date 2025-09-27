import { compileMdx } from '../compile.js'
import { clean } from './test-utils.js'

describe('recma-rewrite', () => {
  const testMdx = `
# h1
## h2 content
### h3 content

- list 1
- list 2
  `

  const testMdxWithDefaultExport = `${testMdx}
export default function Foo(props) {
  return <div>Default Export {props.children}</div>
}
`

  describe("outputFormat: 'function-body'", () => {
    it('should work', async () => {
      const rawMdx = await compileMdx(testMdx)
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
        const { useMDXComponents: _provideComponents } = arguments[0]
        const metadata = {
          title: 'h1'
        }
        function useTOC(props) {
          return [
            {
              value: 'h2 content',
              id: 'h2-content',
              depth: 2
            },
            {
              value: 'h3 content',
              id: 'h3-content',
              depth: 3
            }
          ]
        }
        const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
            ..._provideComponents(),
            ...props.components
          }
          return _jsxs(_Fragment, {
            children: [
              _jsx(_components.h1, {
                children: 'h1'
              }),
              '\\n',
              _jsx(_components.h2, {
                id: toc[0].id,
                children: toc[0].value
              }),
              '\\n',
              _jsx(_components.h3, {
                id: toc[1].id,
                children: toc[1].value
              }),
              '\\n',
              _jsxs(_components.ul, {
                children: [
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 1'
                  }),
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 2'
                  }),
                  '\\n'
                ]
              })
            ]
          })
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }"
      `)
    })
    it('should work with `export default`', async () => {
      const rawMdx = await compileMdx(testMdxWithDefaultExport)
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
        const { useMDXComponents: _provideComponents } = arguments[0]
        const metadata = {
          title: 'h1'
        }
        const MDXLayout = function Foo(props) {
          return _jsxs('div', {
            children: ['Default Export ', props.children]
          })
        }
        function useTOC(props) {
          return [
            {
              value: 'h2 content',
              id: 'h2-content',
              depth: 2
            },
            {
              value: 'h3 content',
              id: 'h3-content',
              depth: 3
            }
          ]
        }
        const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
            ..._provideComponents(),
            ...props.components
          }
          return _jsxs(_Fragment, {
            children: [
              _jsx(_components.h1, {
                children: 'h1'
              }),
              '\\n',
              _jsx(_components.h2, {
                id: toc[0].id,
                children: toc[0].value
              }),
              '\\n',
              _jsx(_components.h3, {
                id: toc[1].id,
                children: toc[1].value
              }),
              '\\n',
              _jsxs(_components.ul, {
                children: [
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 1'
                  }),
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 2'
                  }),
                  '\\n'
                ]
              })
            ]
          })
        }
        function MDXContent(props = {}) {
          return _jsx(MDXLayout, {
            ...props,
            children: _jsx(_createMdxContent, {
              ...props
            })
          })
        }
        return {
          metadata,
          toc,
          default: MDXContent
        }"
      `)
    })

    it('should replace return statement when there is `_missingMdxReference`', async () => {
      const rawMdx = await compileMdx(`
import { MDXRemote } from 'nextra/mdx-remote'

<MDXRemote />`)
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { jsx: _jsx } = arguments[0]
        const { useMDXComponents: _provideComponents } = arguments[0]
        const metadata = {}
        function useTOC(props) {
          return []
        }
        const toc = useTOC({})
        function _createMdxContent(props) {
          const { MDXRemote } = {
            ..._provideComponents(),
            ...props.components
          }
          if (!MDXRemote) _missingMdxReference('MDXRemote', true)
          return _jsx(MDXRemote, {})
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }
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

  describe("outputFormat: 'program'", () => {
    const options = {
      mdxOptions: {
        outputFormat: 'program' as const,
        jsx: true
      }
    }
    it('should work', async () => {
      const rawMdx = await compileMdx(testMdx, options)
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {
          title: 'h1'
        }
        function useTOC(props) {
          return [
            {
              value: 'h2 content',
              id: 'h2-content',
              depth: 2
            },
            {
              value: 'h3 content',
              id: 'h3-content',
              depth: 3
            }
          ]
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
            ..._provideComponents(),
            ...props.components
          }
          return (
            <>
              <_components.h1>{'h1'}</_components.h1>
              {'\\n'}
              <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
              {'\\n'}
              <_components.h3 id={toc[1].id}>{toc[1].value}</_components.h3>
              {'\\n'}
              <_components.ul>
                {'\\n'}
                <_components.li>{'list 1'}</_components.li>
                {'\\n'}
                <_components.li>{'list 2'}</_components.li>
                {'\\n'}
              </_components.ul>
            </>
          )
        }
        export default _createMdxContent"
      `)
    })
    it('should work with `isPageImport`', async () => {
      const rawMdx = await compileMdx(testMdx, {
        ...options,
        isPageImport: true
      })
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { HOC_MDXWrapper } from 'nextra/setup-page'
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {
          title: 'h1'
        }
        function useTOC(props) {
          return [
            {
              value: 'h2 content',
              id: 'h2-content',
              depth: 2
            },
            {
              value: 'h3 content',
              id: 'h3-content',
              depth: 3
            }
          ]
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
            ..._provideComponents(),
            ...props.components
          }
          return (
            <>
              <_components.h1>{'h1'}</_components.h1>
              {'\\n'}
              <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
              {'\\n'}
              <_components.h3 id={toc[1].id}>{toc[1].value}</_components.h3>
              {'\\n'}
              <_components.ul>
                {'\\n'}
                <_components.li>{'list 1'}</_components.li>
                {'\\n'}
                <_components.li>{'list 2'}</_components.li>
                {'\\n'}
              </_components.ul>
            </>
          )
        }
        export default HOC_MDXWrapper(_createMdxContent, {
          metadata,
          toc
        })"
      `)
    })

    it('should work with `export default`', async () => {
      const rawMdx = await compileMdx(testMdxWithDefaultExport, options)
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { HOC_MDXWrapper } from 'nextra/setup-page'
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {
          title: 'h1'
        }
        const MDXLayout = function Foo(props) {
          return <div>Default Export {props.children}</div>
        }
        function useTOC(props) {
          return [
            {
              value: 'h2 content',
              id: 'h2-content',
              depth: 2
            },
            {
              value: 'h3 content',
              id: 'h3-content',
              depth: 3
            }
          ]
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
            ..._provideComponents(),
            ...props.components
          }
          return (
            <>
              <_components.h1>{'h1'}</_components.h1>
              {'\\n'}
              <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
              {'\\n'}
              <_components.h3 id={toc[1].id}>{toc[1].value}</_components.h3>
              {'\\n'}
              <_components.ul>
                {'\\n'}
                <_components.li>{'list 1'}</_components.li>
                {'\\n'}
                <_components.li>{'list 2'}</_components.li>
                {'\\n'}
              </_components.ul>
            </>
          )
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

    it('should have styled inline code and anchor', async () => {
      const rawMdx = await compileMdx(
        '## A `Theme` [google](https://google.com) $e = mc^2$',
        {
          mdxOptions: {
            ...options.mdxOptions,
            providerImportSource: '👍'
          },
          latex: true
        }
      )
      return expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from '👍'
        export const metadata = {}
        function useTOC(props) {
          const _components = {
            a: 'a',
            annotation: 'annotation',
            code: 'code',
            math: 'math',
            mi: 'mi',
            mn: 'mn',
            mo: 'mo',
            mrow: 'mrow',
            msup: 'msup',
            semantics: 'semantics',
            span: 'span',
            ..._provideComponents()
          }
          return [
            {
              value: (
                <>
                  {'A '}
                  <_components.code>{'Theme'}</_components.code>{' '}
                  <_components.a href="https://google.com">{'google'}</_components.a>{' '}
                  <_components.span className="katex">
                    <_components.span className="katex-mathml">
                      <_components.math xmlns="http://www.w3.org/1998/Math/MathML">
                        <_components.semantics>
                          <_components.mrow>
                            <_components.mi>{'e'}</_components.mi>
                            <_components.mo>{'='}</_components.mo>
                            <_components.mi>{'m'}</_components.mi>
                            <_components.msup>
                              <_components.mi>{'c'}</_components.mi>
                              <_components.mn>{'2'}</_components.mn>
                            </_components.msup>
                          </_components.mrow>
                          <_components.annotation encoding="application/x-tex">{'e = mc^2'}</_components.annotation>
                        </_components.semantics>
                      </_components.math>
                    </_components.span>
                    <_components.span className="katex-html" aria-hidden="true">
                      <_components.span className="base">
                        <_components.span
                          className="strut"
                          style={{
                            height: '0.4306em'
                          }}
                        />
                        <_components.span className="mord mathnormal">{'e'}</_components.span>
                        <_components.span
                          className="mspace"
                          style={{
                            marginRight: '0.2778em'
                          }}
                        />
                        <_components.span className="mrel">{'='}</_components.span>
                        <_components.span
                          className="mspace"
                          style={{
                            marginRight: '0.2778em'
                          }}
                        />
                      </_components.span>
                      <_components.span className="base">
                        <_components.span
                          className="strut"
                          style={{
                            height: '0.8141em'
                          }}
                        />
                        <_components.span className="mord mathnormal">{'m'}</_components.span>
                        <_components.span className="mord">
                          <_components.span className="mord mathnormal">{'c'}</_components.span>
                          <_components.span className="msupsub">
                            <_components.span className="vlist-t">
                              <_components.span className="vlist-r">
                                <_components.span
                                  className="vlist"
                                  style={{
                                    height: '0.8141em'
                                  }}
                                >
                                  <_components.span
                                    style={{
                                      top: '-3.063em',
                                      marginRight: '0.05em'
                                    }}
                                  >
                                    <_components.span
                                      className="pstrut"
                                      style={{
                                        height: '2.7em'
                                      }}
                                    />
                                    <_components.span className="sizing reset-size6 size3 mtight">
                                      <_components.span className="mord mtight">{'2'}</_components.span>
                                    </_components.span>
                                  </_components.span>
                                </_components.span>
                              </_components.span>
                            </_components.span>
                          </_components.span>
                        </_components.span>
                      </_components.span>
                    </_components.span>
                  </_components.span>
                </>
              ),
              id: 'a-theme-google-e--mc2',
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
})
