import { compile } from '@mdx-js/mdx'
import type { VFile } from '@mdx-js/mdx/lib/compile'
import remarkFrontmatter from 'remark-frontmatter'
import { clean } from '../../../../__test__/test-utils.js'
import { remarkMdxFrontMatter } from '../remark-mdx-frontmatter.js'

function process(content: string): Promise<VFile> {
  return compile(content, {
    jsx: true,
    remarkPlugins: [remarkFrontmatter, [remarkMdxFrontMatter]]
  })
}

const YAML_FRONTMATTER = '---\nfoo: bar\n---'
const ESM_FRONTMATTER = "export const frontMatter = { foo: 'bar' }"

describe('remarkMdxFrontMatter', () => {
  it('should throw error if both yaml/esm frontmatter are used', () => {
    const processor = process(`${YAML_FRONTMATTER}\n${ESM_FRONTMATTER}`)
    expect(processor).rejects.toThrowError(
      "Both yaml frontMatter and esm export frontMatter aren't supported. Keep only 1."
    )
  })

  describe('yaml frontmatter', async () => {
    const file = await process(YAML_FRONTMATTER)

    it('should export yaml frontmatter', () => {
      expect(clean(file)).resolves.toMatchInlineSnapshot(`
        "export const frontMatter = {
          foo: 'bar'
        }
        function _createMdxContent(props) {
          return <></>
        }
        "
      `)
    })

    it('should not add file.data', () => {
      expect(file.data).toEqual({})
    })
  })

  describe('esm frontmatter', async () => {
    const file = await process(ESM_FRONTMATTER)
    it('should export esm frontmatter', () => {
      expect(clean(file)).resolves.toMatchInlineSnapshot(`
        "export const frontMatter = {
          foo: 'bar'
        }
        function _createMdxContent(props) {
          return <></>
        }
        "
      `)
    })
    it('should not add file.data', () => {
      expect(file.data).toEqual({})
    })
  })
})
