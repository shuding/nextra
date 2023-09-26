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

function createCodeBlock(...languages: string[]) {
  return languages
    .flatMap(lang => ['```' + lang, '', '```'])
    .join('\n')
}

describe('rehypeIcon', () => {
  it('should attach same import only once', async () => {
    const raw = createCodeBlock('css', 'css')

    const { value } = await process(raw)
    expect(await clean(value)).toMatchInlineSnapshot(`
      "import { CssIcon } from \\"nextra/icons\\";
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
            <_components.pre icon={CssIcon} data-language=\\"css\\" data-theme=\\"default\\">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={CssIcon} data-language=\\"css\\" data-theme=\\"default\\">
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
  it('should work with different language', async () => {
    const raw = createCodeBlock(...Object.keys(REHYPE_ICON_DEFAULT_REPLACES))

    const { value } = await process(raw)
    expect(await clean(value)).toMatchInlineSnapshot(`
      "import { JavaScriptIcon } from \\"nextra/icons\\";
      import { TypeScriptIcon } from \\"nextra/icons\\";
      import { MarkdownIcon } from \\"nextra/icons\\";
      import { MdxIcon } from \\"nextra/icons\\";
      import { TerminalIcon } from \\"nextra/icons\\";
      import { CssIcon } from \\"nextra/icons\\";
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
            <_components.pre
              icon={JavaScriptIcon}
              data-language=\\"js\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre
              icon={JavaScriptIcon}
              data-language=\\"jsx\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre
              icon={TypeScriptIcon}
              data-language=\\"ts\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre
              icon={TypeScriptIcon}
              data-language=\\"tsx\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre
              icon={MarkdownIcon}
              data-language=\\"md\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={MdxIcon} data-language=\\"mdx\\" data-theme=\\"default\\">
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre
              icon={TerminalIcon}
              data-language=\\"sh\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre
              icon={TerminalIcon}
              data-language=\\"bash\\"
              data-theme=\\"default\\"
            >
              <_components.code>
                <_components.span> </_components.span>
              </_components.code>
            </_components.pre>
            {\\"\\\\n\\"}
            <_components.pre icon={CssIcon} data-language=\\"css\\" data-theme=\\"default\\">
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
