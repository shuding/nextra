import { compileMdx } from '../src/server/compile.js'
import { clean } from './test-utils.js'

const mdxOptions = {
  jsx: true,
  outputFormat: 'program'
} as const

describe('Process heading', () => {
  it('code-h1', async () => {
    const { result } = await compileMdx('# `codegen.yml`', { mdxOptions })
    expect(clean(result)).resolves.toMatchSnapshot()
  })
  it('code-with-text-h1', async () => {
    const { result } = await compileMdx('# `codegen.yml` file', { mdxOptions })
    expect(clean(result)).resolves.toMatchSnapshot()
  })
  it('static-h1', async () => {
    const { result } = await compileMdx('# Hello World', { mdxOptions })
    expect(clean(result)).resolves.toMatchSnapshot()
  })
  it('dynamic-h1', async () => {
    const res = await compileMdx(
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
    res.result = await clean(res.result)
    expect(res).toMatchSnapshot()
  })
  it('no-h1', async () => {
    const { result } = await compileMdx('## H2', { mdxOptions })
    expect(clean(result)).resolves.toMatchSnapshot()
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
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const frontMatter = {};
      export function useTOC(props) {
        return [
          [\\"extra-space\\", \\"Some extra space\\", 2],
          [\\"extra-space-in-heading\\", \\"Some extra space in heading\\", 3],
          [\\"without-space\\", \\"nospace\\", 3],
          [\\"другой-язык\\", \\"foo\\", 4],
          [\\"bar-baz-\\", \\"bar Baz []\\", 5],
          [\\"bar-qux-\\", \\"bar Qux [#]\\", 6],
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
            <_components.h1 id=\\"test-id\\">{\\"My Header\\"}</_components.h1>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[0][0]}>{toc[0][1]}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[1][0]}>{toc[1][1]}</_components.h3>
            {\\"\\\\n\\"}
            <_components.h3 id={toc[2][0]}>{toc[2][1]}</_components.h3>
            {\\"\\\\n\\"}
            <_components.h4 id={toc[3][0]}>{toc[3][1]}</_components.h4>
            {\\"\\\\n\\"}
            <_components.h5 id={toc[4][0]}>{toc[4][1]}</_components.h5>
            {\\"\\\\n\\"}
            <_components.h6 id={toc[5][0]}>{toc[5][1]}</_components.h6>
          </>
        );
      }
      "
    `)
  })
  it('use github-slugger', async () => {
    const { result } = await compileMdx('### My Header', { mdxOptions })
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const frontMatter = {};
      export function useTOC(props) {
        return [[\\"my-header\\", \\"My Header\\", 3]];
      }
      function _createMdxContent(props) {
        const toc = useTOC(props);
        const _components = Object.assign(
          {
            h3: \\"h3\\",
          },
          _provideComponents(),
          props.components,
        );
        return <_components.h3 id={toc[0][0]}>{toc[0][1]}</_components.h3>;
      }
      "
    `)
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

## latex $l$

## {'interpolate'} {1} {true} {null} {variable}

`,
      { mdxOptions, latex: true }
    )
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
      export const frontMatter = {};
      import FromMdx, { useTOC as useTOC0 } from \\"./one.mdx\\";
      import FromMarkdown, { useTOC as useTOC1 } from \\"./two.md\\";
      import IgnoreMe from \\"./foo\\";
      import Last, { useTOC as useTOC2 } from \\"./three.mdx\\";
      export function useTOC(props) {
        const _components = Object.assign(
            {
              code: \\"code\\",
              span: \\"span\\",
              math: \\"math\\",
              semantics: \\"semantics\\",
              mrow: \\"mrow\\",
              mi: \\"mi\\",
              annotation: \\"annotation\\",
            },
            _provideComponents(),
          ),
          { Kek } = _components;
        if (!Kek) _missingMdxReference(\\"Kek\\", true);
        return [
          [\\"️\\", \\"❤️\\", 2],
          ...useTOC0(),
          [\\"\\", \\"✅\\", 2],
          ...useTOC1(),
          ...useTOC2(),
          [\\"-1\\", \\"👋\\", 2],
          [
            \\"kek-\\",
            <>
              {\\"kek \\"}
              <Kek />
            </>,
            2,
          ],
          [
            \\"try-me\\",
            <>
              <_components.code>{\\"try\\"}</_components.code>
              {\\" me\\"}
            </>,
            2,
          ],
          [
            \\"latex-l\\",
            <>
              {\\"latex \\"}
              <_components.span className=\\"katex\\">
                <_components.span className=\\"katex-mathml\\">
                  <_components.math xmlns=\\"http://www.w3.org/1998/Math/MathML\\">
                    <_components.semantics>
                      <_components.mrow>
                        <_components.mi>{\\"l\\"}</_components.mi>
                      </_components.mrow>
                      <_components.annotation encoding=\\"application/x-tex\\">
                        {\\"l\\"}
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
                  </_components.span>
                </_components.span>
              </_components.span>
            </>,
            2,
          ],
          [
            \\"interpolate-1-true-null-variable\\",
            <>
              {\\"interpolate\\"} {1} {true} {null} {variable}
            </>,
            2,
          ],
        ];
      }
      function _createMdxContent(props) {
        const toc = useTOC(props);
        const _components = Object.assign(
          {
            h2: \\"h2\\",
          },
          _provideComponents(),
          props.components,
        );
        return (
          <>
            <_components.h2 id={toc[0][0]}>{toc[0][1]}</_components.h2>
            {\\"\\\\n\\"}
            <FromMdx />
            {\\"\\\\n\\"}
            <_components.h2 id={toc[1][0]}>{toc[1][1]}</_components.h2>
            {\\"\\\\n\\"}
            <FromMarkdown />
            {\\"\\\\n\\"}
            {\\"\\\\n\\"}
            <Last />
            {\\"\\\\n\\"}
            <IgnoreMe />
            {\\"\\\\n\\"}
            <_components.h2 id={toc[2][0]}>{toc[2][1]}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[3][0]}>{toc[3][1]}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[4][0]}>{toc[4][1]}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[5][0]}>{toc[5][1]}</_components.h2>
            {\\"\\\\n\\"}
            <_components.h2 id={toc[6][0]}>{toc[6][1]}</_components.h2>
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
    expect(result).toMatch(`export function useTOC(props) {
  return [];
}`)
    expect(result).not.toMatch('id=')
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
      { mdxOptions }
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
        { mdxOptions }
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
