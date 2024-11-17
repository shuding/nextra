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
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
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
        const toc = useTOC()
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
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
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
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
        const toc = useTOC()
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
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
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { jsx: _jsx } = arguments[0]
        const metadata = {}
        function useTOC(props) {
          return []
        }
        const toc = useTOC()
        function _createMdxContent(props) {
          const { MDXRemote } = props.components || {}
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
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
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
        export const toc = useTOC()
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
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
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { HOC_MDXWrapper } from 'nextra/setup-page'
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
        export const toc = useTOC()
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
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
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { HOC_MDXWrapper } from 'nextra/setup-page'
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
        export const toc = useTOC()
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            li: 'li',
            ul: 'ul',
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
          }
        }
      )
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic*/
        /*@jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from '👍'
        export const metadata = {}
        function useTOC(props) {
          const _components = {
            a: 'a',
            code: 'code',
            ..._provideComponents()
          }
          return [
            {
              value: (
                <>
                  {'A '}
                  <_components.code>{'Theme'}</_components.code>{' '}
                  <_components.a href="https://google.com">{'google'}</_components.a>
                  {' $e = mc^2$'}
                </>
              ),
              id: 'a-theme-google-e--mc2',
              depth: 2
            }
          ]
        }
        export const toc = useTOC()
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
