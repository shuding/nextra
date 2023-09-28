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

##### String

###### 123

###### Dada 123 true

export const frontMatter = {
  test: 'extract toc content'
}
    `, {
      mdxOptions,
      latex: true
    })
    expect(await clean(result, false)).toMatchInlineSnapshot(`
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
        {
          depth: 5,
          value: \\"String\\",
          id: \\"string\\",
        },
        {
          depth: 6,
          value: \\"123\\",
          id: \\"123\\",
        },
        {
          depth: 6,
          value: \\"Dada 123 true\\",
          id: \\"dada-123-true\\",
        },
      ];
      function _createMdxContent(props) {
        const { toc } = props;
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
            <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[1].id}>{toc[1].value}</_components.h3>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[2].id}>{toc[2].value}</_components.h3>
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <_components.h4 id={toc[3].id}>{toc[3].value}</_components.h4>
            {\\"\\\\n\\"}
            <_components.h5 id={toc[4].id}>{toc[4].value}</_components.h5>
            {\\"\\\\n\\"}
            <_components.h6 id={toc[5].id}>{toc[5].value}</_components.h6>
            {\\"\\\\n\\"}
            <_components.h6 id={toc[6].id}>{toc[6].value}</_components.h6>
          </>
        );
      }
      function MDXContent(props = {}) {
        const toc = useToc(props);
        props = {
          ...props,
          toc,
        };
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
      function useToc(props) {
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
            props.components,
          ),
          { Test } = _components;
        if (!Test) _missingMdxReference(\\"Test\\", true);
        return [
          {
            value: (
              <>
                {\\"Heading \\"}
                {myVar}
              </>
            ),
            id: \\"heading-myvar\\",
            depth: 2,
          },
          {
            value: (
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
              </>
            ),
            id: \\"heading-latex\\",
            depth: 3,
          },
          {
            value: (
              <>
                {\\"Heading \\"}
                <_components.code>{\\"<Code />:{jsx}\\"}</_components.code>
              </>
            ),
            id: \\"heading-code-jsx\\",
            depth: 3,
          },
          {
            value: (
              <>
                <Test />
                {\\" World\\"}
              </>
            ),
            id: \\"-world\\",
            depth: 4,
          },
          {
            value: \\"String\\",
            id: \\"string\\",
            depth: 5,
          },
          {
            value: \\"123\\",
            id: \\"123\\",
            depth: 6,
          },
          {
            value: \\"Dada 123 true\\",
            id: \\"dada-123-true\\",
            depth: 6,
          },
        ];
      }
      function _missingMdxReference(id, component) {
        throw new Error(
          \\"Expected \\" +
            (component ? \\"component\\" : \\"object\\") +
            \\" \`\\" +
            id +
            \\"\` to be defined: you likely forgot to import, pass, or provide it.\\",
        );
      }
      "
    `)
  })
})
