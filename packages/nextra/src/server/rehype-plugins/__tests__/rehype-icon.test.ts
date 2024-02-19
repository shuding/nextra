import { compile } from '@mdx-js/mdx'
import type { VFile } from '@mdx-js/mdx/lib/compile'
import rehypePrettyCode from 'rehype-pretty-code'
import { clean } from '../../../../__test__/test-utils.js'
import {
  DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
  rehypeAttachCodeMeta,
  rehypeIcon,
  rehypeParseCodeMeta
} from '../index.js'
import { REHYPE_ICON_DEFAULT_REPLACES } from '../rehype-icon.js'

function process(content: string): Promise<VFile> {
  return compile(content, {
    jsx: true,
    rehypePlugins: [
      [rehypeParseCodeMeta, { defaultShowCopyCode: true }],
      [rehypePrettyCode, DEFAULT_REHYPE_PRETTY_CODE_OPTIONS] as any,
      rehypeIcon,
      rehypeAttachCodeMeta
    ]
  })
}

function createCodeBlock(...languages: string[]) {
  return languages.flatMap(lang => ['```' + lang, '', '```']).join('\n')
}

describe('rehypeIcon', () => {
  it('should attach same import only once', async () => {
    const raw = createCodeBlock('css', 'css')

    const file = await process(raw)
    expect(clean(file)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { CssIcon } from 'nextra/icons'
      function _createMdxContent(props) {
        const _components = {
          code: 'code',
          pre: 'pre',
          span: 'span',
          ...props.components
        }
        return (
          <>
            <_components.pre icon={CssIcon} tabIndex="0" data-language="css" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CssIcon} tabIndex="0" data-language="css" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
          </>
        )
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = props.components || {}
        return MDXLayout ? (
          <MDXLayout {...props}>
            <_createMdxContent {...props} />
          </MDXLayout>
        ) : (
          _createMdxContent(props)
        )
      }
      "
    `)
  })
  it('should work with different language', async () => {
    const raw = createCodeBlock(...Object.keys(REHYPE_ICON_DEFAULT_REPLACES))

    const file = await process(raw)
    expect(clean(file)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { JavaScriptIcon } from 'nextra/icons'
      import { TypeScriptIcon } from 'nextra/icons'
      import { MarkdownIcon } from 'nextra/icons'
      import { MdxIcon } from 'nextra/icons'
      import { TerminalIcon } from 'nextra/icons'
      import { CssIcon } from 'nextra/icons'
      import { CPPIcon } from 'nextra/icons'
      import { CsharpIcon } from 'nextra/icons'
      import { GraphQLIcon } from 'nextra/icons'
      import { PythonIcon } from 'nextra/icons'
      import { RustIcon } from 'nextra/icons'
      function _createMdxContent(props) {
        const _components = {
          code: 'code',
          pre: 'pre',
          span: 'span',
          ...props.components
        }
        return (
          <>
            <_components.pre icon={JavaScriptIcon} tabIndex="0" data-language="js" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={JavaScriptIcon} tabIndex="0" data-language="jsx" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={TypeScriptIcon} tabIndex="0" data-language="ts" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={TypeScriptIcon} tabIndex="0" data-language="tsx" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={MarkdownIcon} tabIndex="0" data-language="md" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={MdxIcon} tabIndex="0" data-language="mdx" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={TerminalIcon} tabIndex="0" data-language="sh" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={TerminalIcon} tabIndex="0" data-language="bash" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CssIcon} tabIndex="0" data-language="css" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CPPIcon} tabIndex="0" data-language="c++" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CPPIcon} tabIndex="0" data-language="cpp" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CsharpIcon} tabIndex="0" data-language="csharp" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CsharpIcon} tabIndex="0" data-language="cs" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={CsharpIcon} tabIndex="0" data-language="c#" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={GraphQLIcon} tabIndex="0" data-language="graphql" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={PythonIcon} tabIndex="0" data-language="python" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={PythonIcon} tabIndex="0" data-language="py" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={RustIcon} tabIndex="0" data-language="rust" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {'\\n'}
            <_components.pre icon={RustIcon} tabIndex="0" data-language="rs" data-word-wrap="" data-copy="">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
          </>
        )
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = props.components || {}
        return MDXLayout ? (
          <MDXLayout {...props}>
            <_createMdxContent {...props} />
          </MDXLayout>
        ) : (
          _createMdxContent(props)
        )
      }
      "
    `)
  })
})
