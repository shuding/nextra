import { describe, it, expect } from 'vitest'
import { articleOpts, indexOpts, postsOpts } from './__fixture__/pageMap'
import { getStaticTags } from '../src/utils/get-tags'

describe('parent', () => {
  it('string', () => {
    expect(getStaticTags(indexOpts)).toMatchInlineSnapshot(`
      [
        "web development",
      ]
    `)
  })
  it('comma', () => {
    expect(getStaticTags(articleOpts)).toMatchInlineSnapshot(`
      [
        "web development",
        "code",
        "shiki",
      ]
    `)
  })
  it('postsOpts', () => {
    expect(getStaticTags(postsOpts)).toMatchInlineSnapshot(`
      [
        "web development",
        "code",
        "shiki",
      ]
    `)
  })
})