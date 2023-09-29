import { clean } from '../../../../__test__/test-utils.js'
import { compileMdx } from '../../compile.js'

const opts = {
  mdxOptions: {
    jsx: true,
    outputFormat: 'program'
  },
  latex: true
} as const

describe('rehypeExtractTocContent', () => {
  it('should fill heading deeply', async () => {
    const { result } = await compileMdx(
      `
import { Steps } from 'nextra/components'

## baz qux

<Steps>
  <div>
  ### foo bar
  </div>
</Steps>
`,
      opts
    )
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const frontMatter = {};
      import { Steps } from \\"nextra/components\\";
      export function useTOC(props) {
        return [
          [\\"baz-qux\\", \\"baz qux\\", 2],
          [\\"foo-bar\\", \\"foo bar\\", 3],
        ];
      }
      function _createMdxContent(props) {
        const toc = useTOC(props);
        const _components = Object.assign(
          {
            h2: \\"h2\\",
            h3: \\"h3\\",
          },
          _provideComponents(),
          props.components,
        );
        return (
          <>
            <_components.h2 id={toc[0][0]}>{toc[0][1]}</_components.h2>
            {\\"\\\\n\\"}
            <Steps>
              <div>
                <_components.h3 id={toc[1][0]}>{toc[1][1]}</_components.h3>
              </div>
            </Steps>
          </>
        );
      }
      "
    `)
  })

  it('should extract', async () => {
    const { result } = await compileMdx(
      `
# Heading 1

export const myVar = 'interpolated'

## Heading {myVar}

### Heading $latex$

### Heading \`<Code />:{jsx}\`

export const Test = () => <span>Hello</span>

#### <Test /> World

##### String

###### 123

###### Dada 123 true

export const frontMatter = {
  test: 'extract toc content'
}
    `,
      opts
    )
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic @jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
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
      export function useTOC(props) {
        const _components = Object.assign(
          {
            span: \\"span\\",
            math: \\"math\\",
            semantics: \\"semantics\\",
            mrow: \\"mrow\\",
            mi: \\"mi\\",
            annotation: \\"annotation\\",
            code: \\"code\\",
          },
          _provideComponents(),
        );
        return [
          [
            \\"heading-myvar\\",
            <>
              {\\"Heading \\"}
              {myVar}
            </>,
            2,
          ],
          [
            \\"heading-latex\\",
            <>
              {\\"Heading \\"}
              <_components.span className=\\"katex\\">
                <_components.span className=\\"katex-mathml\\">
                  <_components.math xmlns=\\"http://www.w3.org/1998/Math/MathML\\">
                    <_components.semantics>
                      <_components.mrow>
                        <_components.mi>{\\"l\\"}</_components.mi>
                        <_components.mi>{\\"a\\"}</_components.mi>
                        <_components.mi>{\\"t\\"}</_components.mi>
                        <_components.mi>{\\"e\\"}</_components.mi>
                        <_components.mi>{\\"x\\"}</_components.mi>
                      </_components.mrow>
                      <_components.annotation encoding=\\"application/x-tex\\">
                        {\\"latex\\"}
                      </_components.annotation>
                    </_components.semantics>
                  </_components.math>
                </_components.span>
                <_components.span className=\\"katex-html\\" aria-hidden=\\"true\\">
                  <_components.span className=\\"base\\">
                    <_components.span
                      className=\\"strut\\"
                      style={{
                        height: \\"0.6944em\\",
                      }}
                    />
                    <_components.span
                      className=\\"mord mathnormal\\"
                      style={{
                        marginRight: \\"0.01968em\\",
                      }}
                    >
                      {\\"l\\"}
                    </_components.span>
                    <_components.span className=\\"mord mathnormal\\">
                      {\\"a\\"}
                    </_components.span>
                    <_components.span className=\\"mord mathnormal\\">
                      {\\"t\\"}
                    </_components.span>
                    <_components.span className=\\"mord mathnormal\\">
                      {\\"e\\"}
                    </_components.span>
                    <_components.span className=\\"mord mathnormal\\">
                      {\\"x\\"}
                    </_components.span>
                  </_components.span>
                </_components.span>
              </_components.span>
            </>,
            3,
          ],
          [
            \\"heading-code-jsx\\",
            <>
              {\\"Heading \\"}
              <_components.code>{\\"<Code />:{jsx}\\"}</_components.code>
            </>,
            3,
          ],
          [
            \\"-world\\",
            <>
              <Test />
              {\\" World\\"}
            </>,
            4,
          ],
          [\\"string\\", \\"String\\", 5],
          [\\"123\\", \\"123\\", 6],
          [\\"dada-123-true\\", \\"Dada 123 true\\", 6],
        ];
      }
      function _createMdxContent(props) {
        const toc = useTOC(props);
        const _components = Object.assign(
          {
            h1: \\"h1\\",
            h2: \\"h2\\",
            h3: \\"h3\\",
            h4: \\"h4\\",
            h5: \\"h5\\",
            h6: \\"h6\\",
          },
          _provideComponents(),
          props.components,
        );
        return (
          <>
            <_components.h1>{\\"Heading 1\\"}</_components.h1>
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <_components.h2 id={toc[0][0]}>{toc[0][1]}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[1][0]}>{toc[1][1]}</_components.h3>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[2][0]}>{toc[2][1]}</_components.h3>
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <_components.h4 id={toc[3][0]}>{toc[3][1]}</_components.h4>
            {\\"\\\\n\\"}
            <_components.h5 id={toc[4][0]}>{toc[4][1]}</_components.h5>
            {\\"\\\\n\\"}
            <_components.h6 id={toc[5][0]}>{toc[5][1]}</_components.h6>
            {\\"\\\\n\\"}
            <_components.h6 id={toc[6][0]}>{toc[6][1]}</_components.h6>
          </>
        );
      }
      function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = Object.assign(
          {},
          _provideComponents(),
          props.components,
        );
        return MDXLayout ? (
          <MDXLayout {...props}>
            <_createMdxContent {...props} />
          </MDXLayout>
        ) : (
          _createMdxContent(props)
        );
      }
      export default MDXContent;
      "
    `)
  })
})
