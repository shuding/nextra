import { compileMdx } from '../src/server/compile.js'
import { clean } from './test-utils.js'

const mdxOptions = {
  jsx: true,
  outputFormat: 'program'
} as const

describe('Process heading', () => {
  it('code-h1', async () => {
    const result = await compileMdx('# `codegen.yml`', { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('code-with-text-h1', async () => {
    const result = await compileMdx('# `codegen.yml` file', { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('static-h1', async () => {
    const result = await compileMdx('# Hello World', { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('dynamic-h1', async () => {
    const result = await compileMdx(
      `
import { useRouter } from 'next/router'

export const TagName = () => {
  const { tag } = useRouter().query
  return tag || null
}

# Posts Tagged with “<TagName/>”
    `,
      { mdxOptions }
    )
    expect(result).toMatchSnapshot()
  })
  it('no-h1', async () => {
    const result = await compileMdx('## H2', { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('use custom heading id', async () => {
    const { result } = await compileMdx(
      `
# My Header [#test-id]
## Some extra space [#extra-space]&nbsp;
### Some extra space in heading    [#extra-space-in-heading]
### nospace[#without-space]
#### foo [#другой язык]
##### bar Baz []
###### bar Qux [#]`,
      { mdxOptions }
    )
    expect(await clean(result)).toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const frontMatter = {};
      export const toc = [
        {
          depth: 2,
          value: \\"Some extra space\\",
          id: \\"extra-space\\",
        },
        {
          depth: 3,
          value: \\"Some extra space in heading\\",
          id: \\"extra-space-in-heading\\",
        },
        {
          depth: 3,
          value: \\"nospace\\",
          id: \\"without-space\\",
        },
        {
          depth: 4,
          value: \\"foo\\",
          id: \\"другой-язык\\",
        },
        {
          depth: 5,
          value: \\"bar Baz []\\",
          id: \\"bar-baz-\\",
        },
        {
          depth: 6,
          value: \\"bar Qux [#]\\",
          id: \\"bar-qux-\\",
        },
      ];
      function _createMdxContent(props) {
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
            <_components.h1 id=\\"test-id\\">{\\"My Header\\"}</_components.h1>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[1].id}>{toc[1].value}</_components.h3>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[2].id}>{toc[2].value}</_components.h3>
            {\\"\\\\n\\"}
            <_components.h4 id={toc[3].id}>{toc[3].value}</_components.h4>
            {\\"\\\\n\\"}
            <_components.h5 id={toc[4].id}>{toc[4].value}</_components.h5>
            {\\"\\\\n\\"}
            <_components.h6 id={toc[5].id}>{toc[5].value}</_components.h6>
          </>
        );
      }
      "
    `)
  })
  it('use github-slugger', async () => {
    const { result } = await compileMdx('### My Header', { mdxOptions })
    expect(result).toMatch('<_components.h3 id="my-header">{"My Header"}')
  })

  it('should merge headings from partial components', async () => {
    const { result } = await compileMdx(
      `
import FromMdx from './one.mdx'
import FromMarkdown from './two.md'
import IgnoreMe from './foo'

## ❤️

<FromMdx />

## ✅

<FromMarkdown />

import Last from './three.mdx'

<Last />

<IgnoreMe />

## 👋

## kek <Kek />

## \`try\` me

## latex $a=\\sqrt{b^2 + c^2}$

## {'interpolate'} {1} {true} {null} {variable}

`,
      { mdxOptions, latex: true }
    )
    expect(await clean(result)).toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const frontMatter = {};
      import FromMdx, { toc as toc0 } from \\"./one.mdx\\";
      import FromMarkdown, { toc as toc1 } from \\"./two.md\\";
      import IgnoreMe from \\"./foo\\";
      import Last, { toc as toc2 } from \\"./three.mdx\\";
      export const toc = [
        {
          depth: 2,
          value: \\"❤️\\",
          id: \\"️\\",
        },
        ...toc0,
        {
          depth: 2,
          value: \\"✅\\",
          id: \\"\\",
        },
        ...toc1,
        ...toc2,
        {
          depth: 2,
          value: \\"👋\\",
          id: \\"-1\\",
        },
        {
          depth: 2,
          value: \\"kek \\",
          id: \\"kek-\\",
        },
        {
          depth: 2,
          value: \\"try me\\",
          id: \\"try-me\\",
        },
        {
          depth: 2,
          value: \\"latex a=\\\\\\\\sqrt{b^2 + c^2}\\",
          id: \\"latex-asqrtb2--c2\\",
        },
        {
          depth: 2,
          value: (
            <>
              {\\"interpolate\\"} {1} {true} {null} {variable}
            </>
          ),
          id: \\"interpolate-1-true-null-variable\\",
        },
      ];
      function _createMdxContent(props) {
        const _components = Object.assign(
            {
              h2: \\"h2\\",
              code: \\"code\\",
              span: \\"span\\",
              math: \\"math\\",
              semantics: \\"semantics\\",
              mrow: \\"mrow\\",
              mi: \\"mi\\",
              mo: \\"mo\\",
              msqrt: \\"msqrt\\",
              msup: \\"msup\\",
              mn: \\"mn\\",
              annotation: \\"annotation\\",
              svg: \\"svg\\",
              path: \\"path\\",
            },
            _provideComponents(),
            props.components,
          ),
          { Kek } = _components;
        if (!Kek) _missingMdxReference(\\"Kek\\", true);
        return (
          <>
            <_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>
            {\\"\\\\n\\"}
            <FromMdx />
            {\\"\\\\n\\"}
            <_components.h2 id={toc[2].id}>{toc[2].value}</_components.h2>
            {\\"\\\\n\\"}
            <FromMarkdown />
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <Last />
            {\\"\\\\n\\"}
            <IgnoreMe />
            {\\"\\\\n\\"}
            <_components.h2 id={toc[5].id}>{toc[5].value}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[6].id}>
              {\\"kek \\"}
              <Kek />
            </_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[7].id}>
              <_components.code>{\\"try\\"}</_components.code>
              {\\" me\\"}
            </_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[8].id}>
              {\\"latex \\"}
              <_components.span className=\\"katex\\">
                <_components.span className=\\"katex-mathml\\">
                  <_components.math xmlns=\\"http://www.w3.org/1998/Math/MathML\\">
                    <_components.semantics>
                      <_components.mrow>
                        <_components.mi>{\\"a\\"}</_components.mi>
                        <_components.mo>{\\"=\\"}</_components.mo>
                        <_components.msqrt>
                          <_components.mrow>
                            <_components.msup>
                              <_components.mi>{\\"b\\"}</_components.mi>
                              <_components.mn>{\\"2\\"}</_components.mn>
                            </_components.msup>
                            <_components.mo>{\\"+\\"}</_components.mo>
                            <_components.msup>
                              <_components.mi>{\\"c\\"}</_components.mi>
                              <_components.mn>{\\"2\\"}</_components.mn>
                            </_components.msup>
                          </_components.mrow>
                        </_components.msqrt>
                      </_components.mrow>
                      <_components.annotation encoding=\\"application/x-tex\\">
                        {\\"a=\\\\\\\\sqrt{b^2 + c^2}\\"}
                      </_components.annotation>
                    </_components.semantics>
                  </_components.math>
                </_components.span>
                <_components.span className=\\"katex-html\\" aria-hidden=\\"true\\">
                  <_components.span className=\\"base\\">
                    <_components.span
                      className=\\"strut\\"
                      style={{
                        height: \\"0.4306em\\",
                      }}
                    />
                    <_components.span className=\\"mord mathnormal\\">
                      {\\"a\\"}
                    </_components.span>
                    <_components.span
                      className=\\"mspace\\"
                      style={{
                        marginRight: \\"0.2778em\\",
                      }}
                    />
                    <_components.span className=\\"mrel\\">{\\"=\\"}</_components.span>
                    <_components.span
                      className=\\"mspace\\"
                      style={{
                        marginRight: \\"0.2778em\\",
                      }}
                    />
                  </_components.span>
                  <_components.span className=\\"base\\">
                    <_components.span
                      className=\\"strut\\"
                      style={{
                        height: \\"1.04em\\",
                        verticalAlign: \\"-0.1266em\\",
                      }}
                    />
                    <_components.span className=\\"mord sqrt\\">
                      <_components.span className=\\"vlist-t vlist-t2\\">
                        <_components.span className=\\"vlist-r\\">
                          <_components.span
                            className=\\"vlist\\"
                            style={{
                              height: \\"0.9134em\\",
                            }}
                          >
                            <_components.span
                              className=\\"svg-align\\"
                              style={{
                                top: \\"-3em\\",
                              }}
                            >
                              <_components.span
                                className=\\"pstrut\\"
                                style={{
                                  height: \\"3em\\",
                                }}
                              />
                              <_components.span
                                className=\\"mord\\"
                                style={{
                                  paddingLeft: \\"0.833em\\",
                                }}
                              >
                                <_components.span className=\\"mord\\">
                                  <_components.span className=\\"mord mathnormal\\">
                                    {\\"b\\"}
                                  </_components.span>
                                  <_components.span className=\\"msupsub\\">
                                    <_components.span className=\\"vlist-t\\">
                                      <_components.span className=\\"vlist-r\\">
                                        <_components.span
                                          className=\\"vlist\\"
                                          style={{
                                            height: \\"0.7401em\\",
                                          }}
                                        >
                                          <_components.span
                                            style={{
                                              top: \\"-2.989em\\",
                                              marginRight: \\"0.05em\\",
                                            }}
                                          >
                                            <_components.span
                                              className=\\"pstrut\\"
                                              style={{
                                                height: \\"2.7em\\",
                                              }}
                                            />
                                            <_components.span className=\\"sizing reset-size6 size3 mtight\\">
                                              <_components.span className=\\"mord mtight\\">
                                                {\\"2\\"}
                                              </_components.span>
                                            </_components.span>
                                          </_components.span>
                                        </_components.span>
                                      </_components.span>
                                    </_components.span>
                                  </_components.span>
                                </_components.span>
                                <_components.span
                                  className=\\"mspace\\"
                                  style={{
                                    marginRight: \\"0.2222em\\",
                                  }}
                                />
                                <_components.span className=\\"mbin\\">
                                  {\\"+\\"}
                                </_components.span>
                                <_components.span
                                  className=\\"mspace\\"
                                  style={{
                                    marginRight: \\"0.2222em\\",
                                  }}
                                />
                                <_components.span className=\\"mord\\">
                                  <_components.span className=\\"mord mathnormal\\">
                                    {\\"c\\"}
                                  </_components.span>
                                  <_components.span className=\\"msupsub\\">
                                    <_components.span className=\\"vlist-t\\">
                                      <_components.span className=\\"vlist-r\\">
                                        <_components.span
                                          className=\\"vlist\\"
                                          style={{
                                            height: \\"0.7401em\\",
                                          }}
                                        >
                                          <_components.span
                                            style={{
                                              top: \\"-2.989em\\",
                                              marginRight: \\"0.05em\\",
                                            }}
                                          >
                                            <_components.span
                                              className=\\"pstrut\\"
                                              style={{
                                                height: \\"2.7em\\",
                                              }}
                                            />
                                            <_components.span className=\\"sizing reset-size6 size3 mtight\\">
                                              <_components.span className=\\"mord mtight\\">
                                                {\\"2\\"}
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
                            <_components.span
                              style={{
                                top: \\"-2.8734em\\",
                              }}
                            >
                              <_components.span
                                className=\\"pstrut\\"
                                style={{
                                  height: \\"3em\\",
                                }}
                              />
                              <_components.span
                                className=\\"hide-tail\\"
                                style={{
                                  minWidth: \\"0.853em\\",
                                  height: \\"1.08em\\",
                                }}
                              >
                                <_components.svg
                                  xmlns=\\"http://www.w3.org/2000/svg\\"
                                  width=\\"400em\\"
                                  height=\\"1.08em\\"
                                  viewBox=\\"0 0 400000 1080\\"
                                  preserveAspectRatio=\\"xMinYMin slice\\"
                                >
                                  <_components.path
                                    d=\\"M95,702
      c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
      c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
      c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
      s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
      c69,-144,104.5,-217.7,106.5,-221
      l0 -0
      c5.3,-9.3,12,-14,20,-14
      H400000v40H845.2724
      s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
      c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
      M834 80h400000v40h-400000z\\"
                                  />
                                </_components.svg>
                              </_components.span>
                            </_components.span>
                          </_components.span>
                          <_components.span className=\\"vlist-s\\">
                            {\\"​\\"}
                          </_components.span>
                        </_components.span>
                        <_components.span className=\\"vlist-r\\">
                          <_components.span
                            className=\\"vlist\\"
                            style={{
                              height: \\"0.1266em\\",
                            }}
                          >
                            <_components.span />
                          </_components.span>
                        </_components.span>
                      </_components.span>
                    </_components.span>
                  </_components.span>
                </_components.span>
              </_components.span>
            </_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[9].id}>
              {\\"interpolate\\"} {1} {true} {null} {variable}
            </_components.h2>
          </>
        );
      }
      "
    `)
  })
  it('should not attach headings with parent Tab or Tabs.Tab', async () => {
    const { result } = await compileMdx(
      `
<Tab>
 ## foo
</Tab>

<Tabs.Tab>
  ## bar
  ## baz [#custom-id]
</Tabs.Tab>
`,
      { mdxOptions }
    )
    expect(result).toMatch('export const toc = [];')
    expect(result).not.toMatch('id="custom-id"')
  })
})

describe('Link', () => {
  it('supports .md links', async () => {
    const { result } = await compileMdx('[link](../file.md)', { mdxOptions })
    expect(result).toMatch('<_components.a href="../file">')
  })

  it('supports .mdx links', async () => {
    const { result } = await compileMdx('[link](../file.mdx)', { mdxOptions })
    expect(result).toMatch('<_components.a href="../file">')
  })

  it('supports URL links', async () => {
    const { result } = await compileMdx('[link](../file)', { mdxOptions })
    expect(result).toMatch('<_components.a href="../file">')
  })

  it('supports query', async () => {
    const { result } = await compileMdx('[link](../file.md?query=a)', {
      mdxOptions
    })
    expect(result).toMatch('<_components.a href="../file?query=a">')
  })

  it('supports anchor', async () => {
    const { result } = await compileMdx('[link](../file.md#anchor)', {
      mdxOptions
    })
    expect(result).toMatch('<_components.a href="../file#anchor">')
  })

  it('supports external .md links', async () => {
    const { result } = await compileMdx('[link](https://example.com/file.md)', {
      mdxOptions
    })
    expect(result).toMatch('<_components.a href="https://example.com/file.md">')
  })

  it('supports external .mdx links', async () => {
    const { result } = await compileMdx(
      '[link](https://example.com/file.mdx)',
      {
        mdxOptions
      }
    )
    expect(result).toMatch(
      '<_components.a href="https://example.com/file.mdx">'
    )
  })
})

describe('Code block', () => {
  describe('Filename', () => {
    it('attach with "codeHighlight: true" by default', async () => {
      const { result } = await compileMdx('```text filename="test.js"\n```', {
        mdxOptions
      })
      expect(result).toMatch(
        '<_components.pre data-language="text" data-filename="test.js">'
      )
    })

    it('attach with "codeHighlight: false"', async () => {
      const { result } = await compileMdx('```js filename="test.js"\n```', {
        mdxOptions,
        codeHighlight: false
      })
      expect(result).toMatch('<_components.pre data-filename="test.js">')
    })

    it('not highlight filename as substring', async () => {
      const { result } = await compileMdx('```js filename="/foo/"\nfoo\n```', {
        mdxOptions,
        codeHighlight: true // processed only by rehype-pretty-code
      })
      expect(result).not.toMatch(
        'className="highlighted">{"foo"}</_components.span>'
      )
      expect(result).toMatch('}}>{"foo"}</_components.span>')
    })
  })

  describe('Highlight', () => {
    it('should support line highlights', async () => {
      const { result } = await compileMdx(
        '```js filename="test.js" {1}\n123\n```',
        {
          mdxOptions
        }
      )
      expect(result).toMatch('<_components.span data-highlighted-line="">')
    })
  })

  describe('Copy code button', () => {
    for (const codeHighlight of [true, false]) {
      describe(`codeHighlight: ${codeHighlight}`, () => {
        it('attach with "copy"', async () => {
          const { result } = await compileMdx('```js copy\n```', {
            mdxOptions,
            codeHighlight
          })
          expect(result).toMatch('data-copy="">')
        })

        it('attach with "defaultShowCopyCode: true"', async () => {
          const { result } = await compileMdx('```js\n```', {
            mdxOptions,
            defaultShowCopyCode: true,
            codeHighlight
          })
          expect(result).toMatch('data-copy="">')
        })

        it('not attach with "defaultShowCopyCode: true" and "copy=false"', async () => {
          const { result } = await compileMdx('```js copy=false\n```', {
            mdxOptions,
            defaultShowCopyCode: true,
            codeHighlight
          })
          expect(result).not.toMatch('data-copy="">')
        })
      })
    }
  })
})
