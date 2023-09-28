import { compileMdx } from '../../compile.js'
import { clean } from '../../../../__test__/test-utils.js'

describe('rehypeExtractTocContent', () => {
  it('should extract', async () => {
    const mdxOptions = {
      jsx: true,
      outputFormat: 'program'
    } as const
    const { result } = await compileMdx(`
# Heading 1

export const myVar = 'interpolated'

## Heading {myVar}

### Heading $latex$

### Heading \`<Code />:{jsx}\`

export const Test = () => <span>Hello</span>

#### <Test /> World

export const frontMatter = {
  test: 'extract toc content'
}
    `, {
      mdxOptions,
      latex: true
    })
    expect(await clean(result)).toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const myVar = \\"interpolated\\";
      export const Test = () => {
        const _components = Object.assign(
          {
            span: \\"span\\",
          },
          _provideComponents(),
        );
        return <_components.span>Hello</_components.span>;
      };
      export const frontMatter = {
        test: \\"extract toc content\\",
      };
      export const toc = [
        {
          depth: 2,
          value: \\"Heading myVar\\",
          id: \\"heading-myvar\\",
        },
        {
          depth: 3,
          value: \\"Heading latex\\",
          id: \\"heading-latex\\",
        },
        {
          depth: 3,
          value: \\"Heading <Code />:{jsx}\\",
          id: \\"heading-code-jsx\\",
        },
        {
          depth: 4,
          value: \\" World\\",
          id: \\"-world\\",
        },
      ];
      function _createMdxContent(props) {
        const _components = Object.assign(
          {
            h1: \\"h1\\",
            h2: \\"h2\\",
            h3: \\"h3\\",
            h4: \\"h4\\",
          },
          _provideComponents(),
          props.components,
        );
        return (
          <>
            <_components.h1>{\\"Heading 1\\"}</_components.h1>
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <_components.h2 id={toc[0].id} />
            {\\"\\\\n\\"}
            <_components.h3 id={toc[1].id} />
            {\\"\\\\n\\"}
            <_components.h3 id={toc[2].id} />
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <_components.h4 id={toc[3].id} />
          </>
        );
      }
      "
    `)
  })
})
