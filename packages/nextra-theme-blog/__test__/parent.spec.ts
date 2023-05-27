import { describe, expect, it } from 'vitest'
import { getParent } from '../src/utils/parent'
import { articleOpts, config } from './__fixture__/pageMap'

describe('parent', () => {
  it('article', () => {
    expect(getParent({ opts: articleOpts, config })).toMatchInlineSnapshot(`
      {
        "back": "/posts",
        "parentPage": {
          "frontMatter": {
            "date": "2020-01-03T00:00:00.000Z",
            "title": "Random Thoughts",
            "type": "posts",
          },
          "kind": "MdxPage",
          "locale": "",
          "name": "index",
          "route": "/posts",
        },
      }
    `)
  })
})
