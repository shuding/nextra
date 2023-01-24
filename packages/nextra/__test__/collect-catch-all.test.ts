import { collectCatchAllRoutes } from '../src/setup-page'
import { describe, it, expect } from 'vitest'
import { createCatchAllMeta } from '../src/catch-all'

describe('collectCatchAllRoutes', () => {
  it('should collect', () => {
    const meta = {
      kind: 'Meta' as const,
      locale: 'en-US',
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
      kind: 'Folder' as const,
      name: 'nested',
      route: '/remote/nested',
      children: [
        meta,
        { kind: 'Meta', locale: 'es-ES', data: {} },
        { kind: 'Meta', locale: 'ru', data: {} }
      ]
    }
    collectCatchAllRoutes(parent, meta)
    expect(parent).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "data": {
              "configs": "Configs",
              "custom-rules": "Custom Rules",
              "getting-started": "Getting Started",
              "index": "Index",
            },
            "kind": "Meta",
            "locale": "en-US",
          },
          {
            "data": {},
            "kind": "Meta",
            "locale": "es-ES",
          },
          {
            "data": {},
            "kind": "Meta",
            "locale": "ru",
          },
          {
            "kind": "MdxPage",
            "locale": "en-US",
            "name": "configs",
            "route": "/remote/nested/configs",
          },
          {
            "kind": "MdxPage",
            "locale": "en-US",
            "name": "custom-rules",
            "route": "/remote/nested/custom-rules",
          },
          {
            "kind": "MdxPage",
            "locale": "en-US",
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
                "kind": "Meta",
                "locale": "en-US",
              },
              {
                "kind": "MdxPage",
                "locale": "en-US",
                "name": "parser-options",
                "route": "/remote/nested/getting-started/parser-options",
              },
              {
                "kind": "MdxPage",
                "locale": "en-US",
                "name": "parser",
                "route": "/remote/nested/getting-started/parser",
              },
              {
                "children": [
                  {
                    "data": {
                      "foo": "Foo",
                    },
                    "kind": "Meta",
                    "locale": "en-US",
                  },
                  {
                    "kind": "MdxPage",
                    "locale": "en-US",
                    "name": "foo",
                    "route": "/remote/nested/getting-started/third-level/foo",
                  },
                ],
                "kind": "Folder",
                "name": "third-level",
                "route": "/remote/nested/getting-started/third-level",
              },
            ],
            "kind": "Folder",
            "name": "getting-started",
            "route": "/remote/nested/getting-started",
          },
          {
            "kind": "MdxPage",
            "locale": "en-US",
            "name": "index",
            "route": "/remote/nested",
          },
        ],
        "kind": "Folder",
        "name": "nested",
        "route": "/remote/nested",
      }
    `)
  })

  it('should not create MdxPage for "*" key', () => {
    const meta = {
      kind: 'Meta' as const,
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
      kind: 'Folder' as const,
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
            "kind": "Meta",
          },
        ],
        "kind": "Folder",
        "name": "nested",
        "route": "/remote/nested",
      }
    `)
  })
})
