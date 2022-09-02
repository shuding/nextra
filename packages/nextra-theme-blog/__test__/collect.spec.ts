import { describe, it, expect } from 'vitest'
import {
  indexOpts,
  config,
  postsOpts,
  articleOpts
} from './__fixture__/pageMap'
import { collectPostsAndNavs } from '../src/utils/collect'

describe('collect', () => {
  it('page', () => {
    expect(collectPostsAndNavs({ opts: indexOpts, config }))
      .toMatchInlineSnapshot(`
        {
          "navPages": [
            {
              "active": false,
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
            {
              "active": true,
              "frontMatter": {
                "date": "2020-01-01T00:00:00.000Z",
                "title": "About",
                "type": "page",
              },
              "kind": "MdxPage",
              "locale": "",
              "name": "index",
              "route": "/",
            },
          ],
          "posts": [
            {
              "frontMatter": {
                "author": "Shu",
                "date": "2016/5/21",
                "description": "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
                "tag": "web development",
                "title": "Notes on A Programmable Web by Aaron Swartz",
              },
              "kind": "MdxPage",
              "locale": "",
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
          ],
        }
      `)
  })
  it('posts', () => {
    expect(collectPostsAndNavs({ opts: postsOpts, config }))
      .toMatchInlineSnapshot(`
        {
          "navPages": [
            {
              "active": true,
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
            {
              "active": false,
              "frontMatter": {
                "date": "2020-01-01T00:00:00.000Z",
                "title": "About",
                "type": "page",
              },
              "kind": "MdxPage",
              "locale": "",
              "name": "index",
              "route": "/",
            },
          ],
          "posts": [
            {
              "frontMatter": {
                "author": "Shu",
                "date": "2016/5/21",
                "description": "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
                "tag": "web development",
                "title": "Notes on A Programmable Web by Aaron Swartz",
              },
              "kind": "MdxPage",
              "locale": "",
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
          ],
        }
      `)
  })
  it('article', () => {
    expect(collectPostsAndNavs({ opts: articleOpts, config }))
      .toMatchInlineSnapshot(`
        {
          "navPages": [
            {
              "active": false,
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
            {
              "active": false,
              "frontMatter": {
                "date": "2020-01-01T00:00:00.000Z",
                "title": "About",
                "type": "page",
              },
              "kind": "MdxPage",
              "locale": "",
              "name": "index",
              "route": "/",
            },
          ],
          "posts": [
            {
              "frontMatter": {
                "author": "Shu",
                "date": "2016/5/21",
                "description": "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
                "tag": "web development",
                "title": "Notes on A Programmable Web by Aaron Swartz",
              },
              "kind": "MdxPage",
              "locale": "",
              "name": "aaron-swartz-a-programmable-web",
              "route": "/posts/aaron-swartz-a-programmable-web",
            },
          ],
        }
      `)
  })
})
