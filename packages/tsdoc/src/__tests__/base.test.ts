import xyflowReactPackageJson from '@xyflow/react/package.json'
import { NavbarPropsSchema } from '../../../nextra-theme-docs/src/components/navbar/index.js'
import { LayoutPropsSchema } from '../../../nextra-theme-docs/src/layout.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { generateDocumentation } from '../../../nextra/src/server/tsdoc/base.js'
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts.js'

const skipTest = xyflowReactPackageJson.version === '12.5.4'

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
            "type": "ReactNode",
          },
          {
            "description": "Closable banner or not.",
            "name": "dismissible",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "Storage key to keep the banner state.",
            "name": "storageKey",
            "optional": true,
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
            "optional": true,
            "tags": {
              "default": "'No results found.'",
            },
            "type": "ReactNode",
          },
          {
            "description": "Error text.",
            "name": "errorText",
            "optional": true,
            "tags": {
              "default": "'Failed to load search index.'",
            },
            "type": "ReactNode",
          },
          {
            "description": "Loading text.",
            "name": "loading",
            "optional": true,
            "tags": {
              "default": "'Loading…'",
            },
            "type": "ReactNode",
          },
          {
            "description": "Placeholder text.",
            "name": "placeholder",
            "optional": true,
            "tags": {
              "default": "'Search documentation…'",
            },
            "type": "string",
          },
          {
            "description": "CSS class name.",
            "name": "className",
            "optional": true,
            "type": "string",
          },
          {
            "name": "searchOptions",
            "optional": true,
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
            "description": "Defines the style of the callout and determines the default icon if \`emoji\` is not provided.

      If set to \`null\`, no border, background, or text styling will be applied.",
            "name": "type",
            "optional": true,
            "tags": {
              "default": "'default'",
            },
            "type": ""default" | "error" | "info" | "warning" | "important" | null",
          },
          {
            "description": "Icon displayed in the callout. Can be a string emoji or a custom React element.

      Default values based on \`type\`:
      - \`<GitHubTipIcon />\` for \`type: 'default'\`
      - \`<GitHubCautionIcon />\` for \`type: 'error'\`
      - \`<GitHubNoteIcon />\` for \`type: 'info'\`
      - \`<GitHubWarningIcon />\` for \`type: 'warning'\`
      - \`<GitHubImportantIcon />\` for \`type: 'important'\`",
            "name": "emoji",
            "optional": true,
            "tags": {
              "default": "Determined by \`type\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Content to be displayed inside the callout.",
            "name": "children",
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
            "optional": true,
            "tags": {
              "default": "'Submit an issue about broken link'",
            },
            "type": "ReactNode",
          },
          {
            "description": "Labels that can be added to the new created issue.",
            "name": "labels",
            "optional": true,
            "tags": {
              "default": "'bug'",
            },
            "type": "string",
          },
          {
            "description": "Top content of page.",
            "name": "children",
            "optional": true,
            "tags": {
              "default": "<H1>404: Page Not Found</H1>",
            },
            "type": "ReactNode",
          },
          {
            "description": "CSS class name.",
            "name": "className",
            "optional": true,
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
            "optional": true,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Specifies whether the logo should have a link or provides the URL for the logo's link.",
            "name": "logoLink",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "string | boolean",
          },
          {
            "description": "Logo of the website.",
            "name": "logo",
            "tags": {
              "remarks": "\`ReactElement\`",
            },
            "type": "ReactElement",
          },
          {
            "description": "URL of the project homepage.",
            "name": "projectLink",
            "optional": true,
            "type": "string",
          },
          {
            "description": "Icon of the project link.",
            "name": "projectIcon",
            "optional": true,
            "tags": {
              "default": "<GitHubIcon />",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "URL of the chat link.",
            "name": "chatLink",
            "optional": true,
            "type": "string",
          },
          {
            "description": "Icon of the chat link.",
            "name": "chatIcon",
            "optional": true,
            "tags": {
              "default": "<DiscordIcon />",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "CSS class name.",
            "name": "className",
            "optional": true,
            "type": "string",
          },
          {
            "description": "Aligns navigation links to the specified side.",
            "name": "align",
            "optional": true,
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
            "optional": true,
            "tags": {
              "default": "{"dark":204,"light":212}",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The saturation of the primary theme color.<br/>Range: \`0 - 100\`",
            "name": "color.saturation",
            "optional": true,
            "tags": {
              "default": "100",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The lightness of the primary theme color.<br/>Range: \`0 - 100\`",
            "name": "color.lightness",
            "optional": true,
            "tags": {
              "default": "{"dark":55,"light":45}",
            },
            "type": "number | { dark: number; light: number; }",
          },
          {
            "description": "The glyph to use as the favicon.",
            "name": "faviconGlyph",
            "optional": true,
            "type": "string",
          },
          {
            "description": "Background color for dark theme.<br/>Format: \`"rgb(RRR,GGG,BBB)" | "#RRGGBB"\`",
            "name": "backgroundColor.dark",
            "optional": true,
            "tags": {
              "default": ""rgb(17,17,17)"",
            },
            "type": "string",
          },
          {
            "description": "Background color for light theme.<br/>Format: \`"rgb(RRR,GGG,BBB)" | "#RRGGBB"\`",
            "name": "backgroundColor.light",
            "optional": true,
            "tags": {
              "default": ""rgb(250,250,250)"",
            },
            "type": "string",
          },
          {
            "description": "Content of \`<head>\`",
            "name": "children",
            "optional": true,
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
  it('<Layout /> with `flattened: true`', async () => {
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
            "optional": true,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "name": "children",
            "optional": true,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Show or hide the dark mode select button.",
            "name": "darkMode",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "URL of the documentation repository.",
            "name": "docsRepositoryBase",
            "optional": true,
            "tags": {
              "default": ""https://github.com/shuding/nextra"",
            },
            "type": "string",
          },
          {
            "description": "Content of the edit link.",
            "name": "editLink",
            "optional": true,
            "tags": {
              "default": ""Edit this page"",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Content of the feedback link.",
            "name": "feedback.content",
            "optional": true,
            "tags": {
              "default": ""Question? Give us feedback"",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Labels that can be added to the new created issue.",
            "name": "feedback.labels",
            "optional": true,
            "tags": {
              "default": ""feedback"",
            },
            "type": "string",
          },
          {
            "description": "Rendered [\`<Footer>\` component](/docs/docs-theme/built-ins/footer). E.g. \`<Footer {...footerProps} />\`",
            "name": "footer",
            "optional": true,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Options to configure the language dropdown for [the i18n docs website](/docs/guide/i18n).",
            "name": "i18n",
            "optional": true,
            "tags": {
              "default": "[]",
            },
            "type": "{ locale: string; name: string; }[]",
          },
          {
            "description": "Component to render the last updated info.",
            "name": "lastUpdated",
            "optional": true,
            "tags": {
              "default": "<LastUpdated />",
              "remarks": "\`ReactElement\`",
            },
            "type": "ReactElement",
          },
          {
            "description": "Rendered [\`<Navbar>\` component](/docs/docs-theme/built-ins/navbar). E.g. \`<Navbar {...navbarProps} />\`",
            "name": "navbar",
            "optional": true,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Enable or disable navigation link.",
            "name": "navigation",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean | { next: boolean; prev: boolean; }",
          },
          {
            "name": "nextThemes.attribute",
            "optional": true,
            "tags": {
              "default": ""class"",
            },
            "type": ""@TODO TO IMPLEMENT" | "@TODO TO IMPLEMENT"[]",
          },
          {
            "name": "nextThemes.defaultTheme",
            "optional": true,
            "type": "string",
          },
          {
            "name": "nextThemes.disableTransitionOnChange",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "name": "nextThemes.forcedTheme",
            "optional": true,
            "type": "string",
          },
          {
            "name": "nextThemes.storageKey",
            "optional": true,
            "type": "string",
          },
          {
            "description": "Page map list. Result of \`getPageMap(route = '/')\` call.",
            "name": "pageMap",
            "tags": {
              "remarks": "\`PageMapItem[]\`",
            },
            "type": "PageMapItem[]",
          },
          {
            "description": "Rendered [\`<Search>\` component](/docs/built-ins/search). E.g. \`<Search {...searchProps} />\`",
            "name": "search",
            "optional": true,
            "tags": {
              "default": "<Search />",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "If true, automatically collapse inactive folders above \`defaultMenuCollapseLevel\`.",
            "name": "sidebar.autoCollapse",
            "optional": true,
            "type": "boolean",
          },
          {
            "description": "Specifies the folder level at which the menu on the left is collapsed by default.",
            "name": "sidebar.defaultMenuCollapseLevel",
            "optional": true,
            "tags": {
              "default": "2",
            },
            "type": "number",
          },
          {
            "description": "Hide/show sidebar by default.",
            "name": "sidebar.defaultOpen",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "Hide/show sidebar toggle button.",
            "name": "sidebar.toggleButton",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "name": "themeSwitch.dark",
            "optional": true,
            "tags": {
              "default": ""Dark"",
            },
            "type": "string",
          },
          {
            "name": "themeSwitch.light",
            "optional": true,
            "tags": {
              "default": ""Light"",
            },
            "type": "string",
          },
          {
            "name": "themeSwitch.system",
            "optional": true,
            "tags": {
              "default": ""System"",
            },
            "type": "string",
          },
          {
            "description": "Text of back to top button.",
            "name": "toc.backToTop",
            "optional": true,
            "tags": {
              "default": ""Scroll to top"",
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Display extra content below the TOC content.",
            "name": "toc.extraContent",
            "optional": true,
            "tags": {
              "remarks": "\`ReactNode\`",
            },
            "type": "ReactNode",
          },
          {
            "description": "Float the TOC next to the content.",
            "name": "toc.float",
            "optional": true,
            "tags": {
              "default": "true",
            },
            "type": "boolean",
          },
          {
            "description": "Title of the TOC sidebar.",
            "name": "toc.title",
            "optional": true,
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
            "name": "foo",
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
            "name": "breadcrumb",
            "optional": true,
            "tags": {
              "description": "Show or hide breadcrumb navigation.",
            },
            "type": "boolean",
          },
          {
            "description": "Indicates whether the item in sidebar is collapsed by default.",
            "name": "collapsed",
            "optional": true,
            "type": "boolean",
          },
        ],
        "name": "default",
      }
    `)
  })
  it('should show null type', async () => {
    const code = `
type Connection = {
  targetHandle: string | null;
};
export default Connection`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "name": "targetHandle",
            "type": "string | null",
          },
        ],
        "name": "default",
      }
    `)
  })

  describe('functions', () => {
    it('should flatten return type for useThemeConfig', () => {
      const code =
        'export { useThemeConfig as default } from "nextra-theme-docs"'
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "name": "__type",
          "signatures": [
            {
              "params": [],
              "returns": [
                {
                  "name": "search",
                  "type": "string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | Promise<...> | null",
                },
                {
                  "name": "darkMode",
                  "type": "boolean",
                },
                {
                  "name": "docsRepositoryBase",
                  "type": "string",
                },
                {
                  "name": "editLink",
                  "type": "string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | Promise<...> | null",
                },
                {
                  "name": "feedback.content",
                  "type": "string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | Promise<...> | null",
                },
                {
                  "name": "feedback.labels",
                  "type": "string",
                },
                {
                  "name": "i18n",
                  "type": "{ name: string; locale: string; }[]",
                },
                {
                  "name": "lastUpdated",
                  "type": "ReactElement<Record<string, unknown>, string | JSXElementConstructor<any>>",
                },
                {
                  "name": "navigation.next",
                  "type": "boolean",
                },
                {
                  "name": "navigation.prev",
                  "type": "boolean",
                },
                {
                  "name": "sidebar.defaultMenuCollapseLevel",
                  "type": "number",
                },
                {
                  "name": "sidebar.defaultOpen",
                  "type": "boolean",
                },
                {
                  "name": "sidebar.toggleButton",
                  "type": "boolean",
                },
                {
                  "name": "sidebar.autoCollapse",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "themeSwitch.dark",
                  "type": "string",
                },
                {
                  "name": "themeSwitch.light",
                  "type": "string",
                },
                {
                  "name": "themeSwitch.system",
                  "type": "string",
                },
                {
                  "name": "toc.float",
                  "type": "boolean",
                },
                {
                  "name": "toc.backToTop",
                  "type": "string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | Promise<...> | null",
                },
                {
                  "name": "toc.title",
                  "type": "string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | Promise<...> | null",
                },
                {
                  "name": "toc.extraContent",
                  "optional": true,
                  "type": "ReactNode",
                },
                {
                  "name": "children",
                  "optional": true,
                  "type": "ReactNode",
                },
              ],
            },
          ],
        }
      `)
    })

    it('should flatten return type for useConfig', () => {
      const code = 'export { useConfig as default } from "nextra-theme-docs"'
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "name": "useConfig",
          "signatures": [
            {
              "params": [],
              "returns": [
                {
                  "name": "normalizePagesResult.activeType",
                  "optional": true,
                  "type": ""doc" | "page" | "menu"",
                },
                {
                  "name": "normalizePagesResult.activeIndex",
                  "type": "number",
                },
                {
                  "name": "activeThemeContext.pagination",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.breadcrumb",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.collapsed",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.footer",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.layout",
                  "optional": true,
                  "type": ""default" | "full" | undefined",
                },
                {
                  "name": "activeThemeContext.navbar",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.sidebar",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.timestamp",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.toc",
                  "optional": true,
                  "type": "boolean | undefined",
                },
                {
                  "name": "activeThemeContext.typesetting",
                  "optional": true,
                  "type": ""default" | "article" | undefined",
                },
                {
                  "name": "normalizePagesResult.activePath",
                  "type": "Item[]",
                },
                {
                  "name": "normalizePagesResult.directories",
                  "type": "Item[]",
                },
                {
                  "name": "normalizePagesResult.docsDirectories",
                  "type": "((MdxFile | { name: string; route: string; }) & { title: string; type: string; children: any[]; firstChildRoute?: string; isUnderCurrentDocsTree?: boolean; })[]",
                },
                {
                  "name": "normalizePagesResult.flatDocsDirectories",
                  "type": "((MdxFile | { name: string; route: string; }) & { title: string; type: string; children: any[]; firstChildRoute?: string; isUnderCurrentDocsTree?: boolean; })[]",
                },
                {
                  "name": "normalizePagesResult.topLevelNavbarItems",
                  "type": "(PageItem | MenuItem)[]",
                },
                {
                  "description": "Whether the sidebar is shown. If \`false\`, the theme and locale switchers are displayed in the
        \`<Footer>\`.",
                  "name": "hideSidebar",
                  "type": "boolean",
                },
              ],
            },
          ],
        }
      `)
    })

    it('should be parsed in object field', () => {
      const code = `type $ = {
  useNodeConnections: typeof import('@xyflow/react').useNodeConnections
}
export default $
`
      const result = generateDocumentation({ code })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "",
          "entries": [
            {
              "name": "useNodeConnections",
              "type": "({ id, handleType, handleId, onConnect, onDisconnect, }?: UseNodeConnectionsParams | undefined) => NodeConnection[]",
            },
          ],
          "name": "default",
        }
      `)
    })
    it.skipIf(skipTest)('should be parsed as function type', () => {
      const code =
        "export { useNodeConnections as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "This hook returns an array of connections on a specific node, handle type ('source', 'target') or handle ID.",
          "name": "useNodeConnections",
          "params": [
            {
              "description": "ID of the node, filled in automatically if used inside custom node.",
              "name": "[0]?.id",
              "optional": true,
              "type": "string",
            },
            {
              "description": "What type of handle connections do you want to observe?",
              "name": "[0]?.handleType",
              "optional": true,
              "type": "HandleType",
            },
            {
              "description": "Filter by handle id (this is only needed if the node has multiple handles of the same type).",
              "name": "[0]?.handleId",
              "optional": true,
              "type": "string",
            },
            {
              "description": "Gets called when a connection is established.",
              "name": "[0]?.onConnect",
              "optional": true,
              "type": "(connections: Connection[]) => void",
            },
            {
              "description": "Gets called when a connection is removed.",
              "name": "[0]?.onDisconnect",
              "optional": true,
              "type": "(connections: Connection[]) => void",
            },
          ],
          "returns": [
            {
              "description": "An array with connections.",
              "type": "NodeConnection[]",
            },
          ],
          "tags": {
            "example": "\`\`\`jsx
        import { useNodeConnections } from '@xyflow/react';

        export default function () {
         const connections = useNodeConnections({
           handleType: 'target',
           handleId: 'my-handle',
         });

         return (
           <div>There are currently {connections.length} incoming connections!</div>
         );
        }
        \`\`\`",
            "public": "",
            "returns": "An array with connections.",
          },
        }
      `)
    })
    it.skipIf(skipTest)('as function with description', () => {
      const code = "export { useInternalNode as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "This hook returns the internal representation of a specific node.
        Components that use this hook will re-render **whenever the node changes**,
        including when a node is selected or moved.",
          "name": "useInternalNode",
          "params": [
            {
              "description": "The ID of a node you want to observe.",
              "name": "id",
              "tags": {
                "param": "id - The ID of a node you want to observe.",
              },
              "type": "string",
            },
          ],
          "returns": [
            {
              "description": "The \`InternalNode\` object for the node with the given ID.",
              "type": "InternalNode<NodeType> | undefined",
            },
          ],
          "tags": {
            "example": "\`\`\`tsx
        import { useInternalNode } from '@xyflow/react';

        export default function () {
         const internalNode = useInternalNode('node-1');
         const absolutePosition = internalNode.internals.positionAbsolute;

         return (
           <div>
             The absolute position of the node is at:
             <p>x: {absolutePosition.x}</p>
             <p>y: {absolutePosition.y}</p>
           </div>
         );
        }
        \`\`\`",
            "param": "id - The ID of a node you want to observe.",
            "public": "",
            "returns": "The \`InternalNode\` object for the node with the given ID.",
          },
        }
      `)
    })

    it.skipIf(skipTest)("should not throw when symbol isn't found", () => {
      const code = "export { isEdge as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "Test whether an object is usable as an [\`Edge\`](/api-reference/types/edge).
        In TypeScript this is a type guard that will narrow the type of whatever you pass in to
        [\`Edge\`](/api-reference/types/edge) if it returns \`true\`.",
          "name": "__type",
          "signatures": [
            {
              "params": [
                {
                  "description": "The element to test",
                  "name": "element",
                  "tags": {
                    "param": "element - The element to test",
                  },
                  "type": "unknown",
                },
              ],
              "returns": [
                {
                  "description": "Tests whether the provided value can be used as an \`Edge\`. If you're using TypeScript,
        this function acts as a type guard and will narrow the type of the value to \`Edge\` if it returns
        \`true\`.",
                  "type": "boolean",
                },
              ],
            },
          ],
          "tags": {
            "example": "\`\`\`js
        import { isEdge } from '@xyflow/react';

        if (isEdge(edge)) {
        // ...
        }
        \`\`\`",
            "param": "element - The element to test",
            "public": "",
            "remarks": "In TypeScript this is a type guard that will narrow the type of whatever you pass in to Edge if it returns true",
            "returns": "Tests whether the provided value can be used as an \`Edge\`. If you're using TypeScript,
        this function acts as a type guard and will narrow the type of the value to \`Edge\` if it returns
        \`true\`.",
          },
        }
      `)
    })

    it.skipIf(skipTest)('should parse multiple function signatures', () => {
      const code = "export { useNodesData as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "This hook lets you subscribe to changes of a specific nodes \`data\` object.",
          "name": "useNodesData",
          "signatures": [
            {
              "params": [
                {
                  "description": "The id of the node to get the data from.",
                  "name": "nodeId",
                  "type": "string",
                },
              ],
              "returns": [
                {
                  "description": "An object (or array of object) with \`id\`, \`type\`, \`data\` representing each node.",
                  "type": "Pick<NodeType, "id" | "type" | "data"> | null",
                },
              ],
            },
            {
              "params": [
                {
                  "description": "The ids of the nodes to get the data from.",
                  "name": "nodeIds",
                  "type": "string[]",
                },
              ],
              "returns": [
                {
                  "description": "An object (or array of object) with \`id\`, \`type\`, \`data\` representing each node.",
                  "type": "Pick<NodeType, "id" | "type" | "data">[]",
                },
              ],
            },
          ],
          "tags": {
            "example": "\`\`\`jsx
        import { useNodesData } from '@xyflow/react';

        export default function() {
         const nodeData = useNodesData('nodeId-1');
         const nodesData = useNodesData(['nodeId-1', 'nodeId-2']);

         return null;
        }
        \`\`\`",
            "public": "",
            "returns": "An object (or array of object) with \`id\`, \`type\`, \`data\` representing each node.",
          },
        }
      `)
    })

    it('should parse optional parameters', () => {
      const code =
        'function foo(a: string, b?: number, c = true) {}\nexport default foo'
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "name": "foo",
          "signatures": [
            {
              "params": [
                {
                  "name": "a",
                  "type": "string",
                },
                {
                  "name": "b",
                  "optional": true,
                  "type": "number",
                },
                {
                  "name": "c",
                  "optional": true,
                  "type": "boolean",
                },
              ],
              "returns": [
                {
                  "type": "void",
                },
              ],
            },
          ],
        }
      `)
    })

    it('should not flatten tuple type, set, map', () => {
      const code = `
type foo = (params: {
  tuple?: [number, number],
  set?: Set<string>,
  map?: Map<string, number>,
}) => void
export default foo`
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "name": "__type",
          "signatures": [
            {
              "params": [
                {
                  "name": "params.tuple",
                  "optional": true,
                  "type": "[number, number]",
                },
                {
                  "name": "params.set",
                  "optional": true,
                  "type": "Set<string>",
                },
                {
                  "name": "params.map",
                  "optional": true,
                  "type": "Map<string, number>",
                },
              ],
              "returns": [
                {
                  "type": "void",
                },
              ],
            },
          ],
        }
      `)
    })
  })

  it.skipIf(skipTest)('should exclude {@link ...}', () => {
    const code =
      "export { getViewportForBounds as default } from '@xyflow/react'"
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "Returns a viewport that encloses the given bounds with padding.",
        "name": "__type",
        "params": [
          {
            "description": "Bounds to fit inside viewport.",
            "name": "bounds",
            "tags": {
              "param": "bounds - Bounds to fit inside viewport.",
            },
            "type": "Rect",
          },
          {
            "description": "Width of the viewport.",
            "name": "width",
            "tags": {
              "param": "width - Width of the viewport.",
            },
            "type": "number",
          },
          {
            "description": "Height of the viewport.",
            "name": "height",
            "tags": {
              "param": "height - Height of the viewport.",
            },
            "type": "number",
          },
          {
            "description": "Minimum zoom level of the resulting viewport.",
            "name": "minZoom",
            "tags": {
              "param": "minZoom - Minimum zoom level of the resulting viewport.",
            },
            "type": "number",
          },
          {
            "description": "Maximum zoom level of the resulting viewport.",
            "name": "maxZoom",
            "tags": {
              "param": "maxZoom - Maximum zoom level of the resulting viewport.",
            },
            "type": "number",
          },
          {
            "description": "Padding around the bounds.",
            "name": "padding",
            "tags": {
              "param": "padding - Padding around the bounds.",
            },
            "type": "Padding",
          },
        ],
        "returns": [
          {
            "description": "A transformed Viewport that encloses the given bounds which you can pass to e.g. setViewport .",
            "type": "Viewport",
          },
        ],
        "tags": {
          "example": "const { x, y, zoom } = getViewportForBounds(
      { x: 0, y: 0, width: 100, height: 100},
      1200, 800, 0.5, 2);",
          "param": "padding - Padding around the bounds.",
          "public": "",
          "remarks": "You can determine bounds of nodes with {@link getNodesBounds } and {@link getBoundsOfRects}",
          "returns": "A transformed {@link Viewport} that encloses the given bounds which you can pass to e.g. {@link setViewport }.",
        },
      }
    `)
  })

  it.skipIf(skipTest)('should flatten array return type', () => {
    const code = 'export { useEdgesState as default } from "@xyflow/react"'
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "This hook makes it easy to prototype a controlled flow where you manage the
      state of nodes and edges outside the \`ReactFlowInstance\`. You can think of it
      like React's \`useState\` hook with an additional helper callback.",
        "name": "useEdgesState",
        "params": [
          {
            "name": "initialEdges",
            "tags": {
              "param": "initialEdges",
            },
            "type": "EdgeType[]",
          },
        ],
        "returns": [
          {
            "description": "- \`edges\`: The current array of edges. You might pass this directly to the edges prop of your
      \`<ReactFlow />\` component, or you may want to manipulate it first to perform some layouting,
      for example.

      - \`setEdges\`: A function that you can use to update the edges. You can pass it a new array of
      edges or a callback that receives the current array of edges and returns a new array of edges.
      This is the same as the second element of the tuple returned by React's useState hook.

      - \`onEdgesChange\`: A handy callback that can take an array of \`EdgeChanges\` and update the edges
      state accordingly. You'll typically pass this directly to the onEdgesChange prop of your
      \`<ReactFlow />\` component.",
            "type": "[edges: EdgeType[], setEdges: Dispatch<SetStateAction<EdgeType[]>>, onEdgesChange: OnEdgesChange<EdgeType>]",
          },
        ],
        "tags": {
          "example": "\`\`\`tsx
      import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';

      const initialNodes = [];
      const initialEdges = [];

      export default function () {
       const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
       const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

       return (
         <ReactFlow
           nodes={nodes}
           edges={edges}
           onNodesChange={onNodesChange}
           onEdgesChange={onEdgesChange}
         />
       );
      }
      \`\`\`",
          "param": "initialEdges",
          "public": "",
          "remarks": "This hook was created to make prototyping easier and our documentation
      examples clearer. Although it is OK to use this hook in production, in
      practice you may want to use a more sophisticated state management solution
      like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.",
          "returns": "- \`edges\`: The current array of edges. You might pass this directly to the edges prop of your
      \`<ReactFlow />\` component, or you may want to manipulate it first to perform some layouting,
      for example.

      - \`setEdges\`: A function that you can use to update the edges. You can pass it a new array of
      edges or a callback that receives the current array of edges and returns a new array of edges.
      This is the same as the second element of the tuple returned by React's useState hook.

      - \`onEdgesChange\`: A handy callback that can take an array of \`EdgeChanges\` and update the edges
      state accordingly. You'll typically pass this directly to the onEdgesChange prop of your
      \`<ReactFlow />\` component.",
        },
      }
    `)
  })

  it('should parse `unknown` type', () => {
    const code = 'function foo(a?: unknown) {}\nexport default foo'
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "name": "foo",
        "signatures": [
          {
            "params": [
              {
                "name": "a",
                "optional": true,
                "type": "unknown",
              },
            ],
            "returns": [
              {
                "type": "void",
              },
            ],
          },
        ],
      }
    `)
  })

  it('should exclude JSDoc @link in description', () => {
    const code = `type $ = {
  /**
   * By default, we render a small attribution in the corner of your flows that links back to the project.
   *
   * Anyone is free to remove this attribution whether they're a Pro subscriber or not
   * but we ask that you take a quick look at our {@link https://reactflow.dev/learn/troubleshooting/remove-attribution | removing attribution guide}
   * before doing so.
   */
  proOptions?: unknown;
}

export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "entries": [
          {
            "description": "By default, we render a small attribution in the corner of your flows that links back to the project.

      Anyone is free to remove this attribution whether they're a Pro subscriber or not
      but we ask that you take a quick look at our https://reactflow.dev/learn/troubleshooting/remove-attribution removing attribution guide
      before doing so.",
            "name": "proOptions",
            "optional": true,
            "type": "unknown",
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
