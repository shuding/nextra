import { clean } from '../../../__test__/test-utils.js'
import { evaluate } from '../../client/evaluate.js'
import { compileMdx } from '../compile.js'

const YAML_FRONTMATTER = '---\nfoo: bar\n---'
const ESM_FRONTMATTER = "export const metadata = { foo: 'bar' }"

describe('remarkMdxFrontMatter', () => {
  it('should throw error if both yaml/esm frontmatter are used', () => {
    const processor = compileMdx(`${YAML_FRONTMATTER}\n${ESM_FRONTMATTER}`)
    expect(processor).rejects.toThrowError(
      "Both yaml frontMatter and esm export frontMatter aren't supported. Keep only 1."
    )
  })

  describe('yaml frontmatter', async () => {
    const rawJs = await compileMdx(YAML_FRONTMATTER)

    it('should export yaml frontmatter', () => {
      expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx } = arguments[0]
        const metadata = {
          foo: 'bar'
        }
        const toc = []
        function _createMdxContent(props) {
          return _jsx(_Fragment, {})
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }
        "
      `)
    })

    it('should add file.data', () => {
      const { metadata } = evaluate(rawJs)
      expect(metadata).toEqual({ foo: 'bar' })
    })
  })

  describe('esm frontmatter', async () => {
    const rawJs = await compileMdx(ESM_FRONTMATTER)
    it('should export esm frontmatter', () => {
      expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx } = arguments[0]
        const metadata = {
          foo: 'bar'
        }
        const toc = []
        function _createMdxContent(props) {
          return _jsx(_Fragment, {})
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }
        "
      `)
    })
    it('should add file.data', () => {
      const { metadata } = evaluate(rawJs)
      expect(metadata).toEqual({ foo: 'bar' })
    })
  })

  describe('should parse frontMatter', () => {
    const result = {
      string: 'Hello',
      number: 222,
      boolean: true,
      object: {
        prop: 'Foo',
        nested: {
          deep: {
            val: null
          }
        }
      },
      array: ['foo', 1, null, { hello: 'world' }, ['undefined', true, 'Bool']]
    }

    it('yaml', async () => {
      const rawJs = await compileMdx(`---
string: Hello
number: 222
boolean: true
object:
  prop: Foo
  nested:
    deep:
      val: null
array:
  - foo
  - 1
  - null
  - 
    hello: world
  - [undefined, true, Bool]
---
`)
      const { metadata } = evaluate(rawJs)
      expect(metadata).toEqual(result)
    })
    it('esm', async () => {
      const rawJs = await compileMdx(
        `export const metadata = ${JSON.stringify(result)}`
      )
      const { metadata } = evaluate(rawJs)
      expect(metadata).toEqual(result)
    })
  })
})
