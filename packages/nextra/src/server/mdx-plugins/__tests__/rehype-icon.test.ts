import { compile } from '@mdx-js/mdx'
import type { VFile } from '@mdx-js/mdx/lib/compile'
import prettier from 'prettier'
import rehypePrettyCode from 'rehype-pretty-code'
import { DEFAULT_REHYPE_PRETTY_CODE_OPTIONS } from '../../compile.js'
import { attachMeta, parseMeta, rehypeIcon } from '../index.js'
import { REHYPE_ICON_DEFAULT_REPLACES } from '../rehype-icon.js'

function process(content: string): Promise<VFile> {
  return compile(content, {
    jsx: true,
    rehypePlugins: [
      [parseMeta, { defaultShowCopyCode: true }],
      [rehypePrettyCode, DEFAULT_REHYPE_PRETTY_CODE_OPTIONS] as any,
      rehypeIcon,
      attachMeta
    ]
  })
}

function clean(content: any): Promise<string> {
  const cleanedContent = content
    .slice(content.indexOf('\n'), content.lastIndexOf('function MDXContent'))
    .trim()

  return prettier.format(cleanedContent, { parser: 'typescript' })
}

describe('rehypeIcon', () => {
  it('should work with different language', async () => {
    const raw = Object.keys(REHYPE_ICON_DEFAULT_REPLACES)
      .flatMap(lang => ['```' + lang, '', '```'])
      .join('\n')
    const { value } = await process(raw)
    expect(await clean(value)).toMatchInlineSnapshot(`
      "import { MarkdownIcon } from \\"nextra/icons\\";
      function _createMdxContent(props) {
        const _components = Object.assign(
          {
            pre: \\"pre\\",
            code: \\"code\\",
            span: \\"span\\",
          },
          props.components,
        );
        return (
          <>
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MarkdownIcon}>
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
          </>
        );
      }
      "
    `)
  })
})
