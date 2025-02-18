import type { Folder } from '../../types.js'
import { convertToPageMap } from '../page-map/index.js'
import { mergeMetaWithPageMap } from '../page-map/merge-meta-with-page-map.js'

describe('mergeMetaWithPageMap', () => {
  it('should collect', async () => {
    const filePaths = [
      'configs.mdx',
      'custom-rules.mdx',
      'getting-started.mdx',
      'getting-started/parser-options.mdx',
      'getting-started/parser.mdx',
      'index.mdx'
    ]

    const { pageMap } = convertToPageMap({
      filePaths,
      basePath: 'remote/graphql-eslint'
    })
    const [eslintPage] = (pageMap[0] as Folder).children

    // @ts-expect-error -- fixme
    const result = mergeMetaWithPageMap(eslintPage, {
      index: 'Introduction',
      'getting-started': {
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
              "getting-started": {},
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
