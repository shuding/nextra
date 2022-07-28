import { describe, it, expect } from 'vitest'
import {
  config,
  articleOpts,
  postsOpts,
  indexOpts
} from './__fixture__/pageMap'
import { getTitle } from '../src/utils/title'

describe('parent', () => {
  it('index', () => {
    expect(getTitle({ opts: indexOpts, config })).toMatchInlineSnapshot(`
      {
        "pageTitle": "About",
        "title": "About",
      }
    `)
  })

  it('posts', () => {
    expect(getTitle({ opts: postsOpts, config })).toMatchInlineSnapshot(`
      {
        "pageTitle": "Random Thoughts",
        "title": "Random Thoughts",
      }
    `)
  })

  it('article', () => {
    expect(getTitle({ opts: articleOpts, config })).toMatchInlineSnapshot(`
      {
        "pageTitle": "Notes on A Programmable Web by Aaron Swartz",
        "title": "Notes on A Programmable Web by Aaron Swartz",
      }
    `)
  })
})
