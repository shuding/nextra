import { compileMdx } from '../compile.js'
import { clean } from './test-utils.js'

const options = {
  mdxOptions: { jsx: true },
  latex: true
}

describe('LaTeX', () => {
  describe('KaTeX', () => {
    it('should convert ```math code block language', async () => {
      const rawJs = await compileMdx('```math\nx^2\n```', options)
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        'use strict'
        const { useMDXComponents: _provideComponents } = arguments[0]
        const metadata = {}
        function useTOC(props) {
          return []
        }
        const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            annotation: 'annotation',
            math: 'math',
            mi: 'mi',
            mn: 'mn',
            mrow: 'mrow',
            msup: 'msup',
            semantics: 'semantics',
            span: 'span',
            ..._provideComponents(),
            ...props.components
          }
          return (
            <_components.span className="katex-display">
              <_components.span className="katex">
                <_components.span className="katex-mathml">
                  <_components.math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                    <_components.semantics>
                      <_components.mrow>
                        <_components.msup>
                          <_components.mi>{'x'}</_components.mi>
                          <_components.mn>{'2'}</_components.mn>
                        </_components.msup>
                      </_components.mrow>
                      <_components.annotation encoding="application/x-tex">{'x^2\\n'}</_components.annotation>
                    </_components.semantics>
                  </_components.math>
                </_components.span>
                <_components.span className="katex-html" aria-hidden="true">
                  <_components.span className="base">
                    <_components.span
                      className="strut"
                      style={{
                        height: '0.8641em'
                      }}
                    />
                    <_components.span className="mord">
                      <_components.span className="mord mathnormal">{'x'}</_components.span>
                      <_components.span className="msupsub">
                        <_components.span className="vlist-t">
                          <_components.span className="vlist-r">
                            <_components.span
                              className="vlist"
                              style={{
                                height: '0.8641em'
                              }}
                            >
                              <_components.span
                                style={{
                                  top: '-3.113em',
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
            </_components.span>
          )
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }"
      `)
    })
  })

  describe('MathJax', () => {
    const options = {
      mdxOptions: { jsx: true, outputFormat: 'program' },
      latex: { renderer: 'mathjax' }
    } as const

    const INLINE_MATH = String.raw`$a=\sqrt{b^2 + c^2}$`
    const MATH_LANG = '```math\nx^2\n```'

    it('should convert math inline', async () => {
      const rawJs = await compileMdx(INLINE_MATH, options)
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {}
        import { MathJax, MathJaxContext } from 'nextra/components'
        function useTOC(props) {
          return []
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            p: 'p',
            ..._provideComponents(),
            ...props.components
          }
          return (
            <MathJaxContext>
              {'\\n'}
              <_components.p>
                <MathJax inline>{'\\\\(a=\\\\sqrt{b^2 + c^2}\\\\)'}</MathJax>
              </_components.p>
            </MathJaxContext>
          )
        }
        export default _createMdxContent"
      `)
    })

    it('should convert ```math code block language', async () => {
      const rawJs = await compileMdx(MATH_LANG, options)
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {}
        import { MathJax, MathJaxContext } from 'nextra/components'
        function useTOC(props) {
          return []
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          return (
            <MathJaxContext>
              {'\\n'}
              <MathJax>{'\\\\[x^2\\n\\\\]'}</MathJax>
            </MathJaxContext>
          )
        }
        export default _createMdxContent"
      `)
    })

    it('should add imports only once, and move imports/exports at top', async () => {
      const rawMdx = `${INLINE_MATH}

import foo from 'foo'

export let bar

${MATH_LANG}`
      const rawJs = await compileMdx(rawMdx, options)
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from 'next-mdx-import-source-file'
        export const metadata = {}
        import foo from 'foo'
        export let bar
        import { MathJax, MathJaxContext } from 'nextra/components'
        function useTOC(props) {
          return []
        }
        export const toc = useTOC({})
        function _createMdxContent(props) {
          const _components = {
            p: 'p',
            ..._provideComponents(),
            ...props.components
          }
          return (
            <MathJaxContext>
              {'\\n'}
              <_components.p>
                <MathJax inline>{'\\\\(a=\\\\sqrt{b^2 + c^2}\\\\)'}</MathJax>
              </_components.p>
              {'\\n'}
              {'\\n'}
              {'\\n'}
              <MathJax>{'\\\\[x^2\\n\\\\]'}</MathJax>
            </MathJaxContext>
          )
        }
        export default _createMdxContent"
      `)
    })
  })
})
