import { NavbarPropsSchema } from '../../../nextra-theme-docs/src/components/navbar/index.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { generateDocumentation } from '../base.js'
import { generateTsFromZod } from '../zod-to-ts.js'

describe('TypeTable', () => {
  it('<Banner />', async () => {
    const code = `import type { Banner } from 'nextra/components'
type $ = React.ComponentProps<typeof Banner>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
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
      }
    `)
  })
  it('<Search />', async () => {
    const code = `import type { Search } from 'nextra/components'
type $ = React.ComponentProps<typeof Search>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
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
      }
    `)
  })
  it('<Callout />', async () => {
    const code = `import type { Callout } from 'nextra/components'
type $ = React.ComponentProps<typeof Callout>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
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
      }
    `)
  })
  it('<NotFoundPage />', async () => {
    const code = `import type { NotFoundPage } from 'nextra-theme-docs'
type $ = React.ComponentProps<typeof NotFoundPage>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
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
      }
    `)
  })
  it('<Navbar />', async () => {
    const code = `type $ = ${generateTsFromZod(NavbarPropsSchema)}
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "description": "Extra content after last icon.",
            "name": "children",
            "required": false,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Specifies whether the logo should have a link or provides the URL for the logo's link.",
            "name": "logoLink",
            "required": false,
            "tags": {
              "default": "true",
            },
            "type": "string | boolean",
          },
          {
            "description": "Logo of the website.",
            "name": "logo",
            "required": true,
            "tags": {
              "remarks": "\`ReactElement\`",
            },
            "type": "ReactElement",
          },
          {
            "description": "URL of the project homepage.",
            "name": "projectLink",
            "required": false,
            "tags": {},
            "type": "string",
          },
          {
            "description": "Icon of the project link.",
            "name": "projectIcon",
            "required": false,
            "tags": {
              "default": "<GitHubIcon />",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "URL of the chat link.",
            "name": "chatLink",
            "required": false,
            "tags": {},
            "type": "string",
          },
          {
            "description": "Icon of the chat link.",
            "name": "chatIcon",
            "required": false,
            "tags": {
              "default": "<DiscordIcon />",
              "remarks": "\`ReactNode\`",
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
          {
            "description": "Aligns navigation links to the specified side.",
            "name": "align",
            "required": false,
            "tags": {
              "default": ""right"",
            },
            "type": ""left" | "right"",
          },
        ],
        "name": "default",
      }
    `)
  })
  it.only('<Head /> with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(HeadPropsSchema)}
export default $`
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "description": "The hue of the primary theme color. (0 - 360)",
            "name": "color.hue",
            "required": false,
            "tags": {
              "default": "{"dark":204,"light":212}",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The saturation of the primary theme color. (0 - 100)",
            "name": "color.saturation",
            "required": false,
            "tags": {
              "default": "100",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The lightness of the primary theme color. (0 - 100)",
            "name": "color.lightness",
            "required": false,
            "tags": {
              "default": "{"dark":55,"light":45}",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The glyph to use as the favicon.",
            "name": "faviconGlyph",
            "required": false,
            "tags": {},
            "type": "string",
          },
          {
            "description": "Background color for dark theme.",
            "name": "backgroundColor.dark",
            "required": false,
            "tags": {
              "default": ""rgb(17,17,17)"",
            },
            "type": "string",
          },
          {
            "description": "Background color for light theme.",
            "name": "backgroundColor.light",
            "required": false,
            "tags": {
              "default": ""rgb(250,250,250)"",
            },
            "type": "string",
          },
          {
            "description": "Content of \`<head>\`",
            "name": "children",
            "required": false,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
        ],
        "name": "default",
      }
    `)
  })
  it('two declarations', async () => {
    const code = `
type A = { foo: string }
type A = { bar: string }
export default A`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "description": "",
            "name": "foo",
            "required": true,
            "tags": {},
            "type": "string",
          },
        ],
        "name": "default",
      }
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
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
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
      }
    `)
  })
  it.skip('should work with anonymous type', async () => {
    const code = `
type $ = {
  /**
   * test
   * @default null
   */
  foo: React.ReactNode
}
export default $`
    const result = generateDocumentation({ code })
    const result2 = generateDocumentation({
      code: code
        .replace('export default $', '')
        .replace('type $ =', 'export default')
    })
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "description": "",
          "entries": [
            {
              "description": "test",
              "name": "foo",
              "required": true,
              "tags": {
                "default": "null",
              },
              "type": "ReactNode",
            },
          ],
          "name": "default",
        },
      ]
    `)
    expect(result2).toEqual(result)
  })
})
