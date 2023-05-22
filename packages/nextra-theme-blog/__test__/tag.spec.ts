import { describe, it, expect } from 'vitest'
import { articleOpts, indexOpts, postsOpts } from './__fixture__/pageMap'
import { getStaticTags } from '../src/utils/get-tags'

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
