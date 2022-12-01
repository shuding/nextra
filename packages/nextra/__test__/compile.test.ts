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

describe('process heading', () => {
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
})
