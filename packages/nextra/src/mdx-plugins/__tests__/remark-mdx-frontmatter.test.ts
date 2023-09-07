import { compile } from '@mdx-js/mdx'
import type { VFile } from '@mdx-js/mdx/lib/compile'
import remarkFrontmatter from 'remark-frontmatter'
import { remarkMdxFrontMatter } from '../remark-mdx-frontmatter'

function process(content: string, isRemoteContent = false): Promise<VFile> {
  return compile(content, {
    jsx: true,
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontMatter, { isRemoteContent }]
    ]
  })
}

const YAML_FRONTMATTER = '---\nfoo: bar\n---'
const ESM_FRONTMATTER = "export const frontMatter = { foo: 'bar' }"

function trim(value: VFile): string {
  const string = String(value)
  return string
    .slice(0, string.indexOf('function _createMdxContent'))
    .replace('/*@jsxRuntime automatic @jsxImportSource react*/', '')
    .trim()
}

describe('remarkMdxFrontMatter', () => {
  it('should throw error if both yaml/esm frontmatter are used', () => {
    const processor = process(`${YAML_FRONTMATTER}\n${ESM_FRONTMATTER}`)
    expect(() => processor).rejects.toThrowError(
      "Both yaml frontMatter and esm export frontMatter aren't supported. Keep only 1."
    )
  })

  describe('yaml frontmatter', () => {
    describe('not remote content', async () => {
      const file = await process(YAML_FRONTMATTER)

      it.skip('should not add file.data', () => {
        expect(file.data).toEqual({})
      })

      it('should export yaml frontmatter', () => {
        expect(trim(file)).toMatchInlineSnapshot(`
      "export const frontMatter = {
        \\"foo\\": \\"bar\\"
      };"
    `)
      })
    })

    describe('remote content', async () => {
      const file = await process(YAML_FRONTMATTER, true)

      it('should add data.frontMatter', () => {
        expect(file.data).toEqual({ frontMatter: { foo: 'bar' } })
      })

      it('should not export yaml frontmatter', () => {
        expect(trim(file)).toMatchInlineSnapshot('""')
      })
    })
  })

  describe('esm frontmatter', () => {
    describe('not remote content', async () => {
      const file = await process(ESM_FRONTMATTER)
      it.skip('should not add file.data', () => {})

      it('should export esm frontmatter', () => {
        expect(trim(file)).toMatchInlineSnapshot(`
          "export const frontMatter = {
            foo: 'bar'
          };"
        `)
      })
    })

    describe('remote content', async () => {
      const file = await process(ESM_FRONTMATTER, true)
      it('should not export esm frontmatter', () => {
        expect(trim(file)).toMatchInlineSnapshot('""')
      })
    })
  })
})
