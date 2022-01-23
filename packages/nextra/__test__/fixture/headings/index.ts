import fs from 'fs/promises'
import path from 'path'

type Name = 'static-h1.mdx' | 'dynamic-h1.mdx' | 'no-h1.mdx'

export async function loadFixture(name: Name) {
  const filePath = path.join(process.cwd(), 'src', '__test__', 'fixture', 'headings', name)
  return fs.readFile(filePath, 'utf8')
}
