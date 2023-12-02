import { useRouter } from 'next/router'
import type { Mock } from 'vitest'
import { getParent } from '../src/utils/parent'
import { articleOpts, config } from './__fixture__/pageMap'

vi.mock('next/router', () => ({
  useRouter: vi.fn()
}))

describe('parent', () => {
  it('article', () => {
    ;(useRouter as Mock).mockReturnValue({
      route: '/posts/aaron-swartz-a-programmable-web'
    })
    expect(getParent({ opts: articleOpts, config })).toMatchInlineSnapshot(`
      {
        "back": "/posts",
        "parentPage": {
          "frontMatter": {
            "date": "2020-01-03T00:00:00.000Z",
            "title": "Random Thoughts",
            "type": "posts",
          },
          "name": "index",
          "route": "/posts",
        },
      }
    `)
  })
})
