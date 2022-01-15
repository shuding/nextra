import { compileMdx } from '../src/compile'
import { it, describe, expect } from 'vitest'
import path from 'path'
import fs from 'fs/promises'

function loadFixture(name: string) {
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
