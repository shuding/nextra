import { compileMdx } from '../src/compile'
import { it, describe, expect } from 'vitest'
import path from 'path'
import { promises as fs } from 'fs'

type Name =
  | 'code-h1.mdx'
  | 'code-with-text-h1.mdx'
  | 'dynamic-h1.mdx'
  | 'no-h1.mdx'
  | 'static-h1.mdx'

function loadFixture(name: Name) {
  const filePath = path.join(
    process.cwd(),
    '__test__',
    'fixture',
    'headings',
    name
  )
  return fs.readFile(filePath, 'utf8')
}

describe('process heading', () => {
  it('code-h1', async () => {
    const data = await loadFixture('code-h1.mdx')
    const result = await compileMdx(data)
    expect(result).toMatchSnapshot()
  })
  it('code-with-text-h1', async () => {
    const data = await loadFixture('code-with-text-h1.mdx')
    const result = await compileMdx(data)
    expect(result).toMatchSnapshot()
  })
  it('static-h1', async () => {
    const data = await loadFixture('static-h1.mdx')
    const result = await compileMdx(data)
    expect(result).toMatchSnapshot()
  })
  it('dynamic-h1', async () => {
    const data = await loadFixture('dynamic-h1.mdx')
    const result = await compileMdx(data)
    expect(result).toMatchSnapshot()
  })
  it('no-h1', async () => {
    const data = await loadFixture('no-h1.mdx')
    const result = await compileMdx(data)
    expect(result).toMatchSnapshot()
  })
})
