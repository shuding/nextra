import { getTypeTableOutput } from '../utils/type-table'

describe('TypeTable', () => {
  it('<Banner />', async () => {
    const code = `import type { ComponentProps } from 'react'
import type { Banner } from 'nextra/components'
type BannerProps = ComponentProps<typeof Banner>
export default BannerProps`
    const result = await getTypeTableOutput({
      code
    })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "Content of the banner.",
              "name": "children",
              "required": true,
              "tags": {},
              "type": "ReactNode",
            },
            {
              "description": "Closable banner or not.",
              "name": "dismissible",
              "required": false,
              "tags": {
                "default": "true",
              },
              "type": "boolean",
            },
            {
              "description": "Storage key to keep the banner state.",
              "name": "storageKey",
              "required": false,
              "tags": {
                "default": "'nextra-banner'",
              },
              "type": "string",
            },
          ],
          "name": "default",
        },
      ]
    `)
  })
  it('<Search />',  async () => {
    const code = `import type { ComponentProps } from 'react'
import type { Search } from 'nextra/components'
type SearchProps = ComponentProps<typeof Search>
export default SearchProps`
    const result = await getTypeTableOutput({
      code
    })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "Not found text.",
              "name": "emptyResult",
              "required": false,
              "tags": {
                "default": "'No results found.'",
              },
              "type": "ReactNode",
            },
            {
              "description": "Error text.",
              "name": "errorText",
              "required": false,
              "tags": {
                "default": "'Failed to load search index.'",
              },
              "type": "ReactNode",
            },
            {
              "description": "Loading text.",
              "name": "loading",
              "required": false,
              "tags": {
                "default": "'Loading…'",
              },
              "type": "ReactNode",
            },
            {
              "description": "Placeholder text.",
              "name": "placeholder",
              "required": false,
              "tags": {
                "default": "'Search documentation…'",
              },
              "type": "string",
            },
            {
              "description": "CSS class name.",
              "name": "className",
              "required": false,
              "tags": {},
              "type": "string",
            },
            {
              "description": "",
              "name": "searchOptions",
              "required": false,
              "tags": {},
              "type": "PagefindSearchOptions",
            },
          ],
          "name": "default",
        },
      ]
    `)
  })
})
