import { NavbarPropsSchema } from '../../../nextra-theme-docs/src/components/navbar/index.js'
import { LayoutPropsSchema } from '../../../nextra-theme-docs/src/layout.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { generateDocumentation } from '../../../nextra/src/server/tsdoc/base.js'
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts.js'

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
            "type": ""default" | "error" | "info" | "warning" | null",
          },
          {
            "description": "Icon displayed in the callout. Can be a string emoji or a custom React element.

      Default values based on \`type\`:
      - \`'💡'\` for \`type: 'default'\`
      - \`'🚫'\` for \`type: 'error'\`
      - \`<InformationCircleIcon />\` for \`type: 'info'\`
      - \`'⚠️'\` for \`type: 'warning'\`",
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
    it('should be parsed as function type', () => {
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
          "return": {
            "description": "An array with connections.",
            "type": "NodeConnection[]",
          },
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
    it('as function with description', () => {
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
          "return": {
            "description": "The \`InternalNode\` object for the node with the given ID.",
            "type": "InternalNode<NodeType> | undefined",
          },
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

    it('when multiple type declarations, should take only first for now', () => {
      const code =
        "export { useNodesData as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "This hook lets you subscribe to changes of a specific nodes \`data\` object.",
          "name": "useNodesData",
          "params": [
            {
              "description": "The id (or ids) of the node to get the data from",
              "name": "nodeId",
              "tags": {
                "param": "nodeId - The id (or ids) of the node to get the data from",
              },
              "type": "string",
            },
          ],
          "return": {
            "description": "An object (or array of object) with {id, type, data} representing each node",
            "type": "Pick<NodeType, "id" | "type" | "data"> | null",
          },
          "tags": {
            "example": "\`\`\`jsx
        import { useNodesData } from '@xyflow/react';

        export default function() {
         const nodeData = useNodesData('nodeId-1');
         const nodesData = useNodesData(['nodeId-1', 'nodeId-2']);

         return null;
        }
        \`\`\`",
            "param": "nodeId - The id (or ids) of the node to get the data from",
            "public": "",
            "returns": "An object (or array of object) with {id, type, data} representing each node",
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
          "description": "",
          "name": "foo",
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
          "return": {
            "type": "void",
          },
          "tags": {},
        }
      `)
    })

    it('should not flatten tuple type, set, map', () => {
      const code =
        `
type foo = (params: {
  tuple?: [number, number],
  set?: Set<string>,
  map?: Map<string, number>,
}) => void
export default foo`
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "",
          "name": "__type",
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
          "return": {
            "type": "void",
          },
          "tags": {},
        }
      `)
    })
  })

  it('should exclude {@link ...}', () => {
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
        "return": {
          "description": "A transformed Viewport that encloses the given bounds which you can pass to e.g. setViewport .",
          "type": "Viewport",
        },
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

  it('should parse `unknown` type', () => {
    const code = 'function foo(a?: unknown) {}\nexport default foo'
    const result = generateDocumentation({ code, flattened: true })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "",
        "name": "foo",
        "params": [
          {
            "name": "a",
            "optional": true,
            "type": "unknown",
          },
        ],
        "return": {
          "type": "void",
        },
        "tags": {},
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
