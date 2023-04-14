import fs from 'node:fs/promises'
import path from 'node:path'
import { compileMdx } from '../src/compile'
import { it, describe, expect } from 'vitest'
import { CWD } from '../src/constants'

type Name =
  | 'code-h1.mdx'
  | 'code-with-text-h1.mdx'
  | 'dynamic-h1.mdx'
  | 'no-h1.mdx'
  | 'static-h1.mdx'

function loadFixture(name: Name) {
  const filePath = path.join(CWD, '__test__', 'fixture', 'headings', name)
  return fs.readFile(filePath, 'utf8')
}

const mdxOptions = {
  jsx: true,
  outputFormat: 'program' as const
}

describe('Process heading', () => {
  it('code-h1', async () => {
    const data = await loadFixture('code-h1.mdx')
    const result = await compileMdx(data, { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('code-with-text-h1', async () => {
    const data = await loadFixture('code-with-text-h1.mdx')
    const result = await compileMdx(data, { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('static-h1', async () => {
    const data = await loadFixture('static-h1.mdx')
    const result = await compileMdx(data, { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('dynamic-h1', async () => {
    const data = await loadFixture('dynamic-h1.mdx')
    const result = await compileMdx(data, { mdxOptions })
    expect(result).toMatchSnapshot()
  })
  it('no-h1', async () => {
    const data = await loadFixture('no-h1.mdx')
    const result = await compileMdx(data, { mdxOptions })
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
    expect(result).toMatch(`<_components.h1 id="test-id">{"My Header"}`)
    expect(result).toMatch(
      `<_components.h2 id="extra-space">{"Some extra space"}</_components.h2>`
    )
    expect(result).toMatch(
      `<_components.h3 id="extra-space-in-heading">{"Some extra space in heading"}`
    )
    expect(result).toMatch(
      `<_components.h3 id="without-space">{"nospace"}</_components.h3>`
    )
    expect(result).toMatch(`<_components.h4 id="другой язык">{"foo"}`)
    expect(result).toMatch(`<_components.h5 id="bar-baz-">{"bar Baz []"}`)
    expect(result).toMatch(`<_components.h6 id="bar-qux-">{"bar Qux [#]"}`)
  })
  it('use github-slugger', async () => {
    const { result } = await compileMdx(`### My Header`, { mdxOptions })
    expect(result).toMatch(`<_components.h3 id="my-header">{"My Header"}`)
  })
})

describe('Link', () => {
  it('supports .md links', async () => {
    const { result } = await compileMdx(`[link](../file.md)`, { mdxOptions })
    expect(result).toMatch(`<_components.a href="../file">`)
  })

  it('supports .mdx links', async () => {
    const { result } = await compileMdx(`[link](../file.mdx)`, { mdxOptions })
    expect(result).toMatch(`<_components.a href="../file">`)
  })

  it('supports URL links', async () => {
    const { result } = await compileMdx(`[link](../file)`, { mdxOptions })
    expect(result).toMatch(`<_components.a href="../file">`)
  })

  it('supports query', async () => {
    const { result } = await compileMdx(`[link](../file.md?query=a)`, {
      mdxOptions
    })
    expect(result).toMatch(`<_components.a href="../file?query=a">`)
  })

  it('supports anchor', async () => {
    const { result } = await compileMdx(`[link](../file.md#anchor)`, {
      mdxOptions
    })
    expect(result).toMatch(`<_components.a href="../file#anchor">`)
  })

  it('supports external .md links', async () => {
    const { result } = await compileMdx(`[link](https://example.com/file.md)`, {
      mdxOptions
    })
    expect(result).toMatch(`<_components.a href="https://example.com/file.md">`)
  })

  it('supports external .mdx links', async () => {
    const { result } = await compileMdx(
      `[link](https://example.com/file.mdx)`,
      {
        mdxOptions
      }
    )
    expect(result).toMatch(
      `<_components.a href="https://example.com/file.mdx">`
    )
  })
})

describe('Code block', () => {
  describe('Filename', () => {
    it('attach with "codeHighlight: true" by default', async () => {
      const { result } = await compileMdx('```js filename="test.js"\n```', {
        mdxOptions
      })
      expect(result).toMatch(
        '<_components.pre data-language="js" data-theme="default" filename="test.js">'
      )
    })

    it('attach with "codeHighlight: false"', async () => {
      const { result } = await compileMdx('```js filename="test.js"\n```', {
        mdxOptions,
        codeHighlight: false
      })
      expect(result).toMatch('<_components.pre filename="test.js">')
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
      expect(result).toMatch('<_components.span className="line highlighted">')
    })
  })

  describe('Copy code button', () => {
    for (const codeHighlight of [true, false]) {
      describe(`codeHighlight: ${codeHighlight}`, () => {
        it(`attach with "copy"`, async () => {
          const { result } = await compileMdx('```js copy\n```', {
            mdxOptions,
            codeHighlight
          })
          expect(result).toMatch('hasCopyCode>')
        })

        it(`attach with "defaultShowCopyCode: true"`, async () => {
          const { result } = await compileMdx('```js\n```', {
            mdxOptions,
            defaultShowCopyCode: true,
            codeHighlight
          })
          expect(result).toMatch('hasCopyCode>')
        })

        it(`not attach with "defaultShowCopyCode: true" and "copy=false"`, async () => {
          const { result } = await compileMdx('```js copy=false\n```', {
            mdxOptions,
            defaultShowCopyCode: true,
            codeHighlight
          })
          expect(result).not.toMatch('hasCopyCode>')
        })
      })
    }
  })

  it('code block without language has "text" language', async () => {
    const { result } = await compileMdx('```\n```', {
      mdxOptions,
      codeHighlight: false
    })
    expect(result).toMatch('<_components.code className="language-text" />')
  })
})
