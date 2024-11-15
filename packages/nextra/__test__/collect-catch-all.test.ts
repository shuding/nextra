import { collectCatchAllRoutes } from '../src/server/page-map/dynamic.js'

describe('collectCatchAllRoutes', () => {
  it('should collect', async () => {
    // Fixes Error: Failed to resolve import "/_pagefind/pagefind.js" from "dist/client/components/search.js". Does the file exist?
    vi.mock('../../nextra/dist/client/components/search.js', () => ({
      Search: null
    }))
    globalThis.IntersectionObserver = vi.fn(() => ({}) as IntersectionObserver)
    const { eslintPage } = await import(
      '../../../examples/swr-site/app/[lang]/remote/graphql-eslint/[[...slug]]/page.js'
    )

    const result = collectCatchAllRoutes(eslintPage, {
      index: 'Introduction',
      'getting-started': {
        type: 'folder',
        items: {
          'parser-options': 'Parser Options',
          parser: 'Parser'
        }
      },
      configs: 'Configs',
      'custom-rules': 'Custom Rules'
    })

    expect(result).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "data": {
              "configs": "Configs",
              "custom-rules": "Custom Rules",
              "getting-started": "Getting Started",
              "index": "Introduction",
            },
          },
          {
            "name": "configs",
            "route": "/remote/graphql-eslint/configs",
          },
          {
            "name": "custom-rules",
            "route": "/remote/graphql-eslint/custom-rules",
          },
          {
            "children": [
              {
                "data": {
                  "parser": "Parser",
                  "parser-options": "Parser Options",
                },
              },
              {
                "name": "index",
                "route": "/remote/graphql-eslint/getting-started",
              },
              {
                "name": "parser-options",
                "route": "/remote/graphql-eslint/getting-started/parser-options",
              },
              {
                "name": "parser",
                "route": "/remote/graphql-eslint/getting-started/parser",
              },
            ],
            "name": "getting-started",
            "route": "/remote/graphql-eslint/getting-started",
          },
          {
            "name": "index",
            "route": "/remote/graphql-eslint",
          },
        ],
        "name": "graphql-eslint",
        "route": "/remote/graphql-eslint",
      }
    `)
  })
})
