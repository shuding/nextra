import { describe, expect, it } from 'vitest'
import { getStaticTags } from '../src/utils/get-tags'
import { articleOpts, indexOpts, postsOpts } from './__fixture__/pageMap'

describe('parent', () => {
  it('string', () => {
    expect(getStaticTags(indexOpts.pageMap)).toMatchInlineSnapshot(`
      [
        "web development",
      ]
    `)
  })
  it('comma', () => {
    expect(getStaticTags(articleOpts.pageMap)).toMatchInlineSnapshot(`
      [
        "web development",
      ]
    `)
  })
  it('postsOpts', () => {
    expect(getStaticTags(postsOpts.pageMap)).toMatchInlineSnapshot(`
      [
        "web development",
      ]
    `)
  })
})
