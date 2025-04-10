import { NavbarPropsSchema } from '../../../nextra-theme-docs/src/components/navbar/index.js'
import { LayoutPropsSchema } from '../../../nextra-theme-docs/src/layout.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { generateDocumentation } from '../../../nextra/src/server/tsdoc/base.js'
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts.js'
import typesFixture from './fixtures/flattened?raw'

describe('<TSDoc />', () => {
  test('<Banner />', async () => {
    const code = `import type { Banner } from 'nextra/components'
type $ = React.ComponentProps<typeof Banner>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
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
  test('<Search />', async () => {
    const code = `import type { Search } from 'nextra/components'
type $ = React.ComponentProps<typeof Search>
export default $`
    const result = generateDocumentation({ code })
    await expect(result).toMatchFileSnapshot('./snapshots/search.json')
  })
  test('<Callout />', async () => {
    const code = `import type { Callout } from 'nextra/components'
type $ = React.ComponentProps<typeof Callout>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
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
  test('<NotFoundPage />', async () => {
    const code = `import type { NotFoundPage } from 'nextra-theme-docs'
type $ = React.ComponentProps<typeof NotFoundPage>
export default $`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
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
  test('<Navbar />', async () => {
    const code = `type $ = ${generateTsFromZod(NavbarPropsSchema)}
export default $`
    const result = generateDocumentation({ code })
    await expect(result).toMatchFileSnapshot('./snapshots/navbar.json')
  })
  test('<Head /> with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(HeadPropsSchema)}
export default $`
    const result = generateDocumentation({ code, flattened: true })
    await expect(result).toMatchFileSnapshot('./snapshots/head.json')
  })
  test('<Layout /> with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(LayoutPropsSchema)}
export default $`
    const result = generateDocumentation({ code, flattened: true })
    await expect(result).toMatchFileSnapshot(
      './snapshots/theme-docs-layout.json'
    )
  })
  test('two declarations', async () => {
    const code = `
type A = { foo: string }
type A = { bar: string }
export default A`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
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
  test('inline description and @description as tag', async () => {
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
  test('should show null type', async () => {
    const code = `
type Connection = {
  targetHandle: string | null;
};
export default Connection`
    const result = generateDocumentation({ code })
    expect(result).toMatchInlineSnapshot(`
      {
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
    test('should flatten return type for useThemeConfig', async () => {
      const code =
        'export { useThemeConfig as default } from "../nextra-theme-docs/src"'
      const result = generateDocumentation({ code, flattened: true })
      await expect(result).toMatchFileSnapshot(
        './snapshots/use-theme-config.json'
      )
    })

    test('should flatten return type for useConfig', async () => {
      const code = 'export { useConfig as default } from "nextra-theme-docs"'
      const result = generateDocumentation({ code, flattened: true })
      await expect(result).toMatchFileSnapshot('./snapshots/use-config.json')
    })

    test('should be parsed in object field', () => {
      const code = `type $ = {
  useNodeConnections: typeof import('@xyflow/react').useNodeConnections
}
export default $
`
      const result = generateDocumentation({ code })
      expect(result).toMatchInlineSnapshot(`
        {
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
    test('should be parsed as function type', () => {
      const code =
        "export { useNodeConnections as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "This hook returns an array of connections on a specific node, handle type ('source', 'target') or handle ID.",
          "name": "useNodeConnections",
          "signatures": [
            {
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
              "returns": {
                "type": "NodeConnection[]",
              },
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
    test('as function with description', () => {
      const code = "export { useInternalNode as default } from '@xyflow/react'"
      const result = generateDocumentation({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "This hook returns the internal representation of a specific node.
        Components that use this hook will re-render **whenever the node changes**,
        including when a node is selected or moved.",
          "name": "useInternalNode",
          "signatures": [
            {
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
              "returns": {
                "type": "InternalNode<NodeType> | undefined",
              },
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

    test("should not throw when symbol isn't found", () => {
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
              "returns": {
                "type": "boolean",
              },
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

    test('should parse multiple function signatures', () => {
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
              "returns": {
                "type": "Pick<NodeType, "id" | "type" | "data"> | null",
              },
            },
            {
              "params": [
                {
                  "description": "The ids of the nodes to get the data from.",
                  "name": "nodeIds",
                  "type": "string[]",
                },
              ],
              "returns": {
                "type": "Pick<NodeType, "id" | "type" | "data">[]",
              },
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

    test('should parse optional parameters', () => {
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
              "returns": {
                "type": "void",
              },
            },
          ],
        }
      `)
    })

    test('should not flatten tuple type, set, map', () => {
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
              "returns": {
                "type": "void",
              },
            },
          ],
        }
      `)
    })
  })

  test('should exclude {@link ...}', async () => {
    const code =
      "export { getViewportForBounds as default } from '@xyflow/react'"
    const result = generateDocumentation({ code, flattened: true })
    await expect(result).toMatchFileSnapshot(
      './snapshots/get-viewport-for-bounds.json'
    )
  })

  test('should flatten array return type', async () => {
    const code = 'export { useEdgesState as default } from "@xyflow/react"'
    const result = generateDocumentation({ code, flattened: true })
    await expect(result).toMatchFileSnapshot('./snapshots/use-edges-state.json')
  })

  test('should parse `unknown` type', () => {
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
            "returns": {
              "type": "void",
            },
          },
        ],
      }
    `)
  })

  test('should flatten params', async () => {
    const result = generateDocumentation({
      code: "export { getSmoothStepPath as default } from '@xyflow/react'",
      flattened: true
    })
    await expect(result).toMatchFileSnapshot(
      './snapshots/get-smooth-step-path.json'
    )
  })

  test('should remove `undefined` from optional fields', () => {
    const result = generateDocumentation({
      code: `
type $ = {
  a?: string
  b: string | undefined
  c?: string | undefined
}
export default $`,
      flattened: true
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "entries": [
          {
            "name": "a",
            "optional": true,
            "type": "string",
          },
          {
            "name": "b",
            "type": "string | undefined",
          },
          {
            "name": "c",
            "optional": true,
            "type": "string | undefined",
          },
        ],
        "name": "default",
      }
    `)
  })

  test('should flatten only object', async () => {
    const result = generateDocumentation({
      code: typesFixture,
      flattened: true
    })
    await expect(result).toMatchFileSnapshot('./snapshots/flattened.json')
  })

  test('should exclude JSDoc @link in description', () => {
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
