import { describe, it, expect } from 'vitest'
import { config, articleOpts } from './__fixture__/pageMap'
import { getParent } from '../src/utils/parent'

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
