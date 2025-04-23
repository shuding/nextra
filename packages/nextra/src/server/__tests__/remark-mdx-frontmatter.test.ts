import { evaluate } from '../../client/evaluate.js'
import { compileMdx } from '../compile.js'
import { clean } from './test-utils.js'

const YAML_FRONTMATTER = '---\nfoo: bar\n---'
const ESM_FRONTMATTER = "export const metadata = { foo: 'bar' }"

describe('remarkMdxFrontMatter', () => {
  it('should throw error if both yaml/esm frontmatter are used', () => {
    const processor = compileMdx(`${YAML_FRONTMATTER}\n${ESM_FRONTMATTER}`)
    return expect(processor).rejects.toThrowError(
      "Both YAML front matter and `metadata` aren't supported. Keep only 1."
    )
  })

  describe('yaml frontmatter', async () => {
    const rawJs = await compileMdx(YAML_FRONTMATTER)

    it('should export yaml frontmatter', () => {
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx } = arguments[0]
        const { useMDXComponents: _provideComponents } = arguments[0]
        const metadata = {
          foo: 'bar'
        }
        function useTOC(props) {
          return []
        }
        const toc = useTOC({})
        function _createMdxContent(props) {
          return _jsx(_Fragment, {})
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }"
      `)
    })

    it('should add file.data', () => {
      const { metadata } = evaluate(rawJs)
      expect(metadata).toEqual({ foo: 'bar' })
    })
    it('should parse empty front matter', async () => {
      const rawJs = await compileMdx('---\n---')
      const { metadata } = evaluate(rawJs)
      expect(metadata).toEqual({})
    })
  })

  describe('esm frontmatter', async () => {
    const rawJs = await compileMdx(ESM_FRONTMATTER)
    it('should export esm frontmatter', () => {
      return expect(clean(rawJs)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx } = arguments[0]
        const { useMDXComponents: _provideComponents } = arguments[0]
        const metadata = {
          foo: 'bar'
        }
        function useTOC(props) {
          return []
        }
        const toc = useTOC({})
        function _createMdxContent(props) {
          return _jsx(_Fragment, {})
        }
        return {
          metadata,
          toc,
          default: _createMdxContent
        }"
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
