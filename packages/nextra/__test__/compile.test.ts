import prettier from 'prettier'
import { compileMdx } from '../src/server/compile.js'

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
    expect(result).toMatch('<_components.h1 id="test-id">{"My Header"}')
    expect(result).toMatch(
      '<_components.h2 id={toc[0].id}>{toc[0].value}</_components.h2>'
    )
    expect(result).toMatch('<_components.h3 id={toc[1].id}>{toc[1].value}')
    expect(result).toMatch(
      '<_components.h3 id={toc[2].id}>{toc[2].value}</_components.h3>'
    )
    expect(result).toMatch('<_components.h4 id={toc[3].id}>{toc[3].value}')
    expect(result).toMatch('<_components.h5 id={toc[4].id}>{toc[4].value}')
    expect(result).toMatch('<_components.h6 id={toc[5].id}>{toc[5].value}')
  })
  it('use github-slugger', async () => {
    const { result } = await compileMdx('### My Header', { mdxOptions })
    expect(result).toMatch('<_components.h3 id={toc[0].id}>{toc[0].value}')
  })

  it.only('should merge headings from partial components', async () => {
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
`,
      { mdxOptions }
    )
    expect(await prettier.format(result, { parser: 'typescript' }))
      .toMatchInlineSnapshot(`
        "/*@jsxRuntime automatic @jsxImportSource react*/
        import { useMDXComponents as _provideComponents } from \\"nextra/mdx\\";
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
        ];
        function _createMdxContent(props) {
          const _components = Object.assign(
              {
                h2: \\"h2\\",
                code: \\"code\\",
              },
              _provideComponents(),
              props.components,
            ),
            { Kek } = _components;
          if (!Kek) _missingMdxReference(\\"Kek\\", true);
          return (
            <>
              <_components.h2 id=\\"️\\">{hello}</_components.h2>
              {\\"\\\\n\\"}
              <FromMdx />
              {\\"\\\\n\\"}
              <_components.h2 id=\\"\\">{hello}</_components.h2>
              {\\"\\\\n\\"}
              <FromMarkdown />
              {\\"\\\\n\\"}
              {\\"\\\\n\\"}
              <Last />
              {\\"\\\\n\\"}
              <IgnoreMe />
              {\\"\\\\n\\"}
              <_components.h2 id=\\"-1\\">{hello}</_components.h2>
              {\\"\\\\n\\"}
              <_components.h2 id=\\"kek-\\">{hello}</_components.h2>
              {\\"\\\\n\\"}
              <_components.h2 id=\\"try-me\\">{hello}</_components.h2>
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
