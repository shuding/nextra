import { createCatchAllMeta } from '../src/client/catch-all.js'
import { collectCatchAllRoutes } from '../src/server/page-map-dynamic.js'

describe('collectCatchAllRoutes', () => {
  it('should collect', () => {
    const meta = {
      data: createCatchAllMeta([
        'configs.md',
        'custom-rules.md',
        'getting-started.md',
        'getting-started/parser-options.md',
        'getting-started/parser.md',
        'getting-started/third-level/foo.md',
        'index.md'
      ])
    }
    const parent = {
      name: 'nested',
      route: '/remote/nested',
      children: []
    }
    expect(collectCatchAllRoutes(parent, meta)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "data": {
              "configs": "Configs",
              "custom-rules": "Custom Rules",
              "getting-started": "Getting Started",
              "index": "Index",
            },
          },
          {
            "name": "configs",
            "route": "/remote/nested/configs",
          },
          {
            "name": "custom-rules",
            "route": "/remote/nested/custom-rules",
          },
          {
            "name": "getting-started",
            "route": "/remote/nested/getting-started",
          },
          {
            "children": [
              {
                "data": {
                  "parser": "Parser",
                  "parser-options": "Parser Options",
                  "third-level": "Third Level",
                },
              },
              {
                "name": "parser-options",
                "route": "/remote/nested/getting-started/parser-options",
              },
              {
                "name": "parser",
                "route": "/remote/nested/getting-started/parser",
              },
              {
                "children": [
                  {
                    "data": {
                      "foo": "Foo",
                    },
                  },
                  {
                    "name": "foo",
                    "route": "/remote/nested/getting-started/third-level/foo",
                  },
                ],
                "name": "third-level",
                "route": "/remote/nested/getting-started/third-level",
              },
            ],
            "name": "getting-started",
            "route": "/remote/nested/getting-started",
          },
          {
            "name": "index",
            "route": "/remote/nested",
          },
        ],
        "name": "nested",
        "route": "/remote/nested",
      }
    `)
  })

  it('should not create MdxPage for "*" key', () => {
    const meta = {
      data: createCatchAllMeta([], {
        '*': {
          type: 'page',
          display: 'hidden',
          theme: {
            layout: 'full',
            timestamp: false
          }
        }
      })
    }
    const parent = {
      name: 'nested',
      route: '/remote/nested',
      children: [meta]
    }
    collectCatchAllRoutes(parent, meta)
    expect(parent).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "data": {
              "*": {
                "display": "hidden",
                "theme": {
                  "layout": "full",
                  "timestamp": false,
                },
                "type": "page",
              },
            },
          },
        ],
        "name": "nested",
        "route": "/remote/nested",
      }
    `)
  })
})
