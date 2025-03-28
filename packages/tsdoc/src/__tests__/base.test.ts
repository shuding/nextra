import { NavbarPropsSchema } from '../../../nextra-theme-docs/src/components/navbar/index.js'
import { LayoutPropsSchema } from '../../../nextra-theme-docs/src/layout.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { generateDocumentation } from '../base.js'
import { generateTsFromZod } from '../zod-to-ts.js'

describe('<TSDoc />', () => {
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
  it('<Head /> with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(HeadPropsSchema)}
export default $`
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "description": "The hue of the primary theme color.<br/>Range: \`0 - 360\`",
            "name": "color.hue",
            "required": false,
            "tags": {
              "default": "{"dark":204,"light":212}",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The saturation of the primary theme color.<br/>Range: \`0 - 100\`",
            "name": "color.saturation",
            "required": false,
            "tags": {
              "default": "100",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The lightness of the primary theme color.<br/>Range: \`0 - 100\`",
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
            "description": "Background color for dark theme.<br/>Format: \`"rgb(RRR,GGG,BBB)" | "#RRGGBB"\`",
            "name": "backgroundColor.dark",
            "required": false,
            "tags": {
              "default": ""rgb(17,17,17)"",
            },
            "type": "string",
          },
          {
            "description": "Background color for light theme.<br/>Format: \`"rgb(RRR,GGG,BBB)" | "#RRGGBB"\`",
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
  it.only('<Layout /> with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(LayoutPropsSchema)}
export default $`
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "description": "Rendered [\`<Banner>\` component](/docs/built-ins/banner). E.g. \`<Banner {...bannerProps} />\`",
            "name": "banner",
            "required": false,
            "tags": {
              "remarks": "\`<Banner />\`",
            },
            "type": "<Banner />",
          },
          {
            "description": "",
            "name": "children",
            "required": false,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Show or hide the dark mode select button.",
            "name": "darkMode",
            "required": false,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "URL of the documentation repository.",
            "name": "docsRepositoryBase",
            "required": false,
            "tags": {
              "default": ""https://github.com/shuding/nextra"",
            },
            "type": "string",
          },
          {
            "description": "Content of the edit link.",
            "name": "editLink",
            "required": false,
            "tags": {
              "default": ""Edit this page"",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "",
            "name": "feedback.content",
            "required": false,
            "tags": {
              "default": ""Question? Give us feedback"",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "",
            "name": "feedback.labels",
            "required": false,
            "tags": {
              "default": ""feedback"",
            },
            "type": "string",
          },
          {
            "description": "Rendered [\`<Footer>\` component](/docs/docs-theme/built-ins/footer). E.g. \`<Footer {...footerProps} />\`",
            "name": "footer",
            "required": false,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "",
            "name": "i18n",
            "required": false,
            "tags": {
              "default": "[]",
            },
            "type": "{ locale: string; name: string; }[]",
          },
          {
            "description": "Component to render the last updated info.",
            "name": "lastUpdated",
            "required": false,
            "tags": {},
            "type": ""@TODO TO IMPLEMENT"",
          },
          {
            "description": "Rendered [\`<Navbar>\` component](/docs/docs-theme/built-ins/navbar). E.g. \`<Navbar {...navbarProps} />\`",
            "name": "navbar",
            "required": false,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Enable or disable navigation link.",
            "name": "navigation",
            "required": false,
            "tags": {},
            "type": "boolean | { next: boolean; prev: boolean; }",
          },
          {
            "description": "",
            "name": "nextThemes.attribute",
            "required": false,
            "tags": {
              "default": ""class"",
            },
            "type": ""@TODO TO IMPLEMENT" | "@TODO TO IMPLEMENT"[]",
          },
          {
            "description": "",
            "name": "nextThemes.defaultTheme",
            "required": false,
            "tags": {},
            "type": "string",
          },
          {
            "description": "",
            "name": "nextThemes.disableTransitionOnChange",
            "required": false,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "",
            "name": "nextThemes.forcedTheme",
            "required": false,
            "tags": {},
            "type": "string",
          },
          {
            "description": "",
            "name": "nextThemes.storageKey",
            "required": false,
            "tags": {},
            "type": "string",
          },
          {
            "description": "Page map list. Result of \`getPageMap(route = '/')\` call.",
            "name": "pageMap",
            "required": true,
            "tags": {
              "remarks": "\`PageMapItem[]\`",
            },
            "type": "PageMapItem[]",
          },
          {
            "description": "Rendered [\`<Search>\` component](/docs/built-ins/search). E.g. \`<Search {...searchProps} />\`",
            "name": "search",
            "required": false,
            "tags": {
              "default": "\`<Search />\`",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "",
            "name": "sidebar.autoCollapse",
            "required": false,
            "tags": {},
            "type": "boolean",
          },
          {
            "description": "",
            "name": "sidebar.defaultMenuCollapseLevel",
            "required": false,
            "tags": {
              "default": "2",
            },
            "type": "number",
          },
          {
            "description": "",
            "name": "sidebar.defaultOpen",
            "required": false,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "",
            "name": "sidebar.toggleButton",
            "required": false,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "",
            "name": "themeSwitch.dark",
            "required": false,
            "tags": {
              "default": ""Dark"",
            },
            "type": "string",
          },
          {
            "description": "",
            "name": "themeSwitch.light",
            "required": false,
            "tags": {
              "default": ""Light"",
            },
            "type": "string",
          },
          {
            "description": "",
            "name": "themeSwitch.system",
            "required": false,
            "tags": {
              "default": ""System"",
            },
            "type": "string",
          },
          {
            "description": "",
            "name": "toc.backToTop",
            "required": false,
            "tags": {
              "default": ""Scroll to top"",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "",
            "name": "toc.extraContent",
            "required": false,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "",
            "name": "toc.float",
            "required": false,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "",
            "name": "toc.title",
            "required": false,
            "tags": {
              "default": ""On This Page"",
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
