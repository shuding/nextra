import { compile } from '@mdx-js/mdx';
import type { VFile } from '@mdx-js/mdx/lib/compile';
import rehypePrettyCode from 'rehype-pretty-code';
import { DEFAULT_REHYPE_PRETTY_CODE_OPTIONS } from '../../compile.js';
import { parseMeta, rehypeIcon, attachMeta } from '../index.js';


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

describe('rehypeIcon', () => {
  it('should work', async () => {
    const { value } = await process(['```md', '', '```'].join('\n'))
    expect(value).toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic @jsxImportSource react*/
      import {MarkdownIcon} from \\"nextra/icons\\";
      function _createMdxContent(props) {
        const _components = Object.assign({
          pre: \\"pre\\",
          code: \\"code\\",
          span: \\"span\\"
        }, props.components);
        return <_components.pre icon={MarkdownIcon}><_components.code data-language=\\"md\\" data-theme=\\"default\\"><_components.span>{\\" \\"}</_components.span></_components.code></_components.pre>;
      }
      function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = props.components || ({});
        return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
      }
      export default MDXContent;
      "
    `)
  })
})
