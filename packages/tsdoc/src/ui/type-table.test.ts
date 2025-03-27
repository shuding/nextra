import { getTypeTableOutput } from '../utils/type-table.js'

describe('TypeTable', () => {
  it('<Banner />', async () => {
    const code = `import type { Banner } from 'nextra/components'
type $ = React.ComponentProps<typeof Banner>
export default $`
    const result = await getTypeTableOutput({ code })
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
  it('<Search />', async () => {
    const code = `import type { Search } from 'nextra/components'
type $ = React.ComponentProps<typeof Search>
export default $`
    const result = await getTypeTableOutput({ code })
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
  it('<Callout />', async () => {
    const code = `import type { Callout } from 'nextra/components'
type $ = React.ComponentProps<typeof Callout>
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "Specifies the type of callout.
      Determines the default icon if none is provided.",
              "name": "type",
              "required": false,
              "tags": {
                "default": "'default'",
              },
              "type": ""default" | "error" | "info" | "warning"",
            },
            {
              "description": "Icon displayed in the callout. Can be a string emoji or a custom React element.

      Default values based on \`type\`:
      - \`'💡'\` for \`type: 'default'\`
      - \`'🚫'\` for \`type: 'error'\`
      - \`<InformationCircleIcon />\` for \`type: 'info'\`
      - \`'⚠️'\` for \`type: 'warning'\`",
              "name": "emoji",
              "required": false,
              "tags": {
                "default": "Determined by \`type\`",
              },
              "type": "ReactNode",
            },
            {
              "description": "Content to be displayed inside the callout.",
              "name": "children",
              "required": true,
              "tags": {},
              "type": "ReactNode",
            },
          ],
          "name": "default",
        },
      ]
    `)
  })
  it('<NotFoundPage />', async () => {
    const code = `import type { NotFoundPage } from 'nextra-theme-docs'
type $ = React.ComponentProps<typeof NotFoundPage>
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "Content of the link.",
              "name": "content",
              "required": false,
              "tags": {
                "default": "'Submit an issue about broken link'",
              },
              "type": "ReactNode",
            },
            {
              "description": "Labels that can be added to the new created issue.",
              "name": "labels",
              "required": false,
              "tags": {
                "default": "'bug'",
              },
              "type": "string",
            },
            {
              "description": "Top content of page.",
              "name": "children",
              "required": false,
              "tags": {
                "default": "<H1>404: Page Not Found</H1>",
              },
              "type": "ReactNode",
            },
            {
              "description": "CSS class name.",
              "name": "className",
              "required": false,
              "tags": {},
              "type": "string",
            },
          ],
          "name": "default",
        },
      ]
    `)
  })
  it('inline description and @description as tag', async () => {
    const code = `type $ = {
/**
 * @description Show or hide breadcrumb navigation.
 */
breadcrumb?: boolean

/**
 * Indicates whether the item in sidebar is collapsed by default.
 */
collapsed?: boolean
}
export default $`
    const result = await getTypeTableOutput({ code })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "",
              "name": "breadcrumb",
              "required": false,
              "tags": {
                "description": "Show or hide breadcrumb navigation.",
              },
              "type": "boolean",
            },
            {
              "description": "Indicates whether the item in sidebar is collapsed by default.",
              "name": "collapsed",
              "required": false,
              "tags": {},
              "type": "boolean",
            },
          ],
          "name": "default",
        },
      ]
    `)
  })
})
