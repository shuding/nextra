import { LayoutPropsSchema } from '../../../nextra-theme-docs/src/schemas.js'
import { HeadPropsSchema } from '../../../nextra/src/client/components/head.js'
import { NextraConfigSchema } from '../../../nextra/src/server/schemas.js'
import { generateDefinition } from '../../../nextra/src/server/tsdoc/base.js'
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts.js'
import typesFixture from './fixtures/flattened?raw'

describe('generateDefinition()', () => {
  test('useMDXComponents', () => {
    const code =
      "export { useMDXComponents as default } from 'nextra/mdx-components'"
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "Get current MDX components.",
        "filePath": "../nextra/dist/client/mdx-components.d.ts",
        "name": "useMDXComponents",
        "signatures": [
          {
            "params": [
              {
                "description": "An object where:
      - The key is the name of the HTML element to override.
      - The value is the component to render instead.",
                "name": "components",
                "tags": {
                  "remarks": "\`MDXComponents\`",
                },
                "type": "MDXComponents",
              },
            ],
            "returns": {
              "type": "DefaultMDXComponents & components",
            },
          },
          {
            "params": [],
            "returns": {
              "type": "DefaultMDXComponents",
            },
          },
        ],
        "tags": {
          "returns": "The current set of MDX components.",
        },
      }
    `)
  })
  test('Should parse type tags', () => {
    const code = `
/**
 * MyType description
 * @tag MyTag
 */
type MyType = {
  /** MyType.foo */
  foo?: string
}
export default MyType`
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "MyType description",
        "entries": [
          {
            "description": "MyType.foo",
            "name": "foo",
            "optional": true,
            "type": "string",
          },
        ],
        "name": "MyType",
        "tags": {
          "tag": "MyTag",
        },
      }
    `)
  })
  test('<Tabs />', async () => {
    const code = "export type { Tabs as default } from 'nextra/components'"
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "A built-in component for creating tabbed content, helping organize related information in a
      compact, interactive layout.",
        "filePath": "../nextra/dist/client/components/tabs/index.d.ts",
        "name": "Tabs",
        "signatures": [
          {
            "params": [
              {
                "name": "props",
                "type": "{ items: (TabItem | TabObjectItem)[]; children: ReactNode; storageKey?: string; className?: string | ((bag: ListRenderPropArg) => string) | undefined; tabClassName?: string | ... 1 more ... | undefined; } & Pick<...>",
              },
            ],
            "returns": {
              "type": "react_jsx_runtime_js.JSX.Element",
            },
          },
        ],
        "tags": {
          "example": "<Tabs items={['pnpm', 'npm', 'yarn']}>
        <Tabs.Tab>**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
        <Tabs.Tab>**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
        <Tabs.Tab>**Yarn** is a software packaging system.</Tabs.Tab>
      </Tabs>",
          "usage": "\`\`\`mdx
      import { Tabs } from 'nextra/components'

      <Tabs items={['pnpm', 'npm', 'yarn']}>
        <Tabs.Tab>**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
        <Tabs.Tab>**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
        <Tabs.Tab>**Yarn** is a software packaging system.</Tabs.Tab>
      </Tabs>
      \`\`\`

      ### Default Selected Index

      You can use the \`defaultIndex\` prop to set the default tab index:

      \`\`\`mdx /defaultIndex="1"/
      import { Tabs } from 'nextra/components'

      <Tabs items={['pnpm', 'npm', 'yarn']} defaultIndex="1">
        ...
      </Tabs>
      \`\`\`

      And you will have \`npm\` as the default tab:

      <Tabs items={['pnpm', 'npm', 'yarn']} defaultIndex="1">
        <Tabs.Tab>**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
        <Tabs.Tab>**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
        <Tabs.Tab>**Yarn** is a software packaging system.</Tabs.Tab>
      </Tabs>",
        },
      }
    `)
  })
  test('<Steps />', async () => {
    const code = "export type { Steps as default } from 'nextra/components'"
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "description": "A built-in component to turn a numbered list into a visual representation of
      steps.",
        "filePath": "../nextra/dist/client/components/steps.d.ts",
        "name": "Steps",
        "signatures": [
          {
            "params": [
              {
                "name": "props",
                "type": "HTMLAttributes<HTMLDivElement>",
              },
            ],
            "returns": {
              "type": "ReactNode | Promise<ReactNode>",
            },
          },
        ],
        "tags": {
          "example": "<Steps>

      ### This is the first step

      This is the first step description.

      ### This is the second step

      This is the second step description.

      ### This is the third step

      This is the third step description.

      </Steps>",
          "usage": "Wrap a set of Markdown headings (from \`<h2>\` to \`<h6>\`) with the \`<Steps>\`
      component to display them as visual steps. You can choose the appropriate
      heading level based on the content hierarchy on the page.

      \`\`\`mdx filename="MDX" {7-15}
      import { Steps } from 'nextra/components'

      ## Getting Started

      Here is some description.

      <Steps>
      ### Step 1

      Contents for step 1.

      ### Step 2

      Contents for step 2.
      </Steps>
      \`\`\`

      ### Excluding Headings from Table of Contents

      To exclude the headings from the \`<Steps>\` component (or any other headings)
      to appear in the Table of Contents, replace the Markdown headings \`### ...\`
      with \`<h3>\` HTML element wrapped in curly braces.

      \`\`\`diff filename="MDX"
      <Steps>
      - ### Step 1
      + {<h3>Step 1</h3>}

      Contents for step 1.
      </Steps>
      \`\`\`",
        },
      }
    `)
  })
  test('<Banner />', async () => {
    // TODO check `tw` prop
    const groupKeys = 'React.HTMLAttributes<HTMLDivElement>'
    const code = `import type { Banner } from 'nextra/components'
type $ = React.ComponentProps<typeof Banner>
type $$ = Omit<$, keyof ${groupKeys} | 'tw'> & { '...props': ${groupKeys} }>
export default $$`
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "entries": [
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
          {
            "name": "...props",
            "type": "HTMLAttributes<HTMLDivElement>",
          },
        ],
        "name": "$$",
      }
    `)
  })
  test('<Search />', async () => {
    const code = `import type { Search } from 'nextra/components'
type $ = React.ComponentProps<typeof Search>
export default $`
    const result = generateDefinition({ code })
    await expect(result).toMatchFileSnapshot('./snapshots/search.json')
  })
  test('<Callout />', async () => {
    // TODO check `tw` prop
    const groupKeys = 'React.HTMLAttributes<HTMLDivElement>'
    const code = `import type { Callout } from 'nextra/components'
type $ = React.ComponentProps<typeof Callout>
type $$ = Omit<$, keyof ${groupKeys} | 'tw'> & { '...props': ${groupKeys} }>
export default $$`
    const result = generateDefinition({ code })
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
            "name": "...props",
            "type": "HTMLAttributes<HTMLDivElement>",
          },
        ],
        "name": "$$",
      }
    `)
  })
  test('<NotFoundPage />', async () => {
    const code = `import type { NotFoundPage } from 'nextra-theme-docs'
type $ = React.ComponentProps<typeof NotFoundPage>
export default $`
    const result = generateDefinition({ code })
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
            "description": "Labels that can be added to the newly created issue.",
            "name": "labels",
            "optional": true,
            "tags": {
              "default": "'bug'",
            },
            "type": "string",
          },
          {
            "description": "Top content of the page.",
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
        "name": "$",
      }
    `)
  })
  test('<Navbar />', async () => {
    const code = `import { Navbar } from 'nextra-theme-docs'
type $ = React.ComponentProps<typeof Navbar>
export default $`
    const result = generateDefinition({ code })
    await expect(result).toMatchFileSnapshot('./snapshots/navbar.json')
  })
  test('<Head /> with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(HeadPropsSchema)}
export default $`
    const result = generateDefinition({ code, flattened: true })
    await expect(result).toMatchFileSnapshot('./snapshots/head.json')
  })
  test('DocsLayoutProps with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(LayoutPropsSchema)}
export default $`
    const result = generateDefinition({ code, flattened: true })
    await expect(result).toMatchFileSnapshot('./snapshots/layout-props.json')
  })
  test('NextraConfig with `flattened: true`', async () => {
    const code = `type $ = ${generateTsFromZod(NextraConfigSchema)}
export default $`
    const result = generateDefinition({ code, flattened: true })
    await expect(result).toMatchFileSnapshot('./snapshots/nextra-config.json')
  })
  test('two declarations', async () => {
    const code = `
type A = { foo: string }
type A = { bar: string }
export default A`
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "entries": [
          {
            "name": "foo",
            "type": "string",
          },
        ],
        "name": "A",
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
    const result = generateDefinition({ code })
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
        "name": "$",
      }
    `)
  })
  test('should show null type', async () => {
    const code = `
type Connection = {
  targetHandle: string | null;
};
export default Connection`
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "entries": [
          {
            "name": "targetHandle",
            "type": "string | null",
          },
        ],
        "name": "Connection",
      }
    `)
  })

  describe('functions', () => {
    test('should flatten return type for useThemeConfig', async () => {
      const code =
        'export { useThemeConfig as default } from "../nextra-theme-docs/src"'
      const result = generateDefinition({ code, flattened: true })
      await expect(result).toMatchFileSnapshot(
        './snapshots/use-theme-config.json'
      )
    })
    test('ReactFlowInstance', async () => {
      const code =
        'export { ReactFlowInstance as default } from "@xyflow/react"'
      const result = generateDefinition({ code, flattened: true })
      await expect(result).toMatchFileSnapshot(
        './snapshots/react-flow-instance.json'
      )
    })

    test('should flatten return type for useConfig', async () => {
      const code = 'export { useConfig as default } from "nextra-theme-docs"'
      const result = generateDefinition({ code, flattened: true })
      await expect(result).toMatchFileSnapshot('./snapshots/use-config.json')
    })

    test('should be parsed in object field', () => {
      const code = `type $ = {
  useNodeConnections: typeof import('@xyflow/react').useNodeConnections
}
export default $
`
      const result = generateDefinition({ code })
      expect(result).toMatchInlineSnapshot(`
        {
          "entries": [
            {
              "name": "useNodeConnections",
              "type": "({ id, handleType, handleId, onConnect, onDisconnect, }?: UseNodeConnectionsParams | undefined) => NodeConnection[]",
            },
          ],
          "name": "$",
        }
      `)
    })
    test('should be parsed as function type', () => {
      const code =
        "export { useNodeConnections as default } from '@xyflow/react'"
      const { filePath: _, ...result } = generateDefinition({
        code,
        flattened: true
      })
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
      const { filePath: _, ...result } = generateDefinition({
        code,
        flattened: true
      })
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
      const { filePath: _, ...result } = generateDefinition({
        code,
        flattened: true
      })
      expect(result).toMatchInlineSnapshot(`
        {
          "description": "Test whether an object is usable as an [\`Edge\`](/api-reference/types/edge).
        In TypeScript this is a type guard that will narrow the type of whatever you pass in to
        [\`Edge\`](/api-reference/types/edge) if it returns \`true\`.",
          "name": "isEdge",
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
      const { filePath: _, ...result } = generateDefinition({
        code,
        flattened: true
      })
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
      const result = generateDefinition({ code, flattened: true })
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
      const result = generateDefinition({ code, flattened: true })
      expect(result).toMatchInlineSnapshot(`
        {
          "name": "foo",
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
    const result = generateDefinition({ code, flattened: true })
    await expect(result).toMatchFileSnapshot(
      './snapshots/get-viewport-for-bounds.json'
    )
  })

  test('should flatten array return type', async () => {
    const code = 'export { useEdgesState as default } from "@xyflow/react"'
    const { filePath: _, ...result } = generateDefinition({
      code,
      flattened: true
    })
    await expect(result).toMatchFileSnapshot('./snapshots/use-edges-state.json')
  })

  test('should parse `unknown` type', () => {
    const code = 'function foo(a?: unknown) {}\nexport default foo'
    const result = generateDefinition({ code, flattened: true })
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
    const result = generateDefinition({
      code: "export { getSmoothStepPath as default } from '@xyflow/react'",
      flattened: true
    })
    await expect(result).toMatchFileSnapshot(
      './snapshots/get-smooth-step-path.json'
    )
  })

  test('should remove `undefined` from optional fields', () => {
    const result = generateDefinition({
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
        "name": "$",
      }
    `)
  })

  test('should flatten only object', async () => {
    const result = generateDefinition({
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
    const result = generateDefinition({ code })
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
        "name": "$",
      }
    `)
  })

  it('should not flatten Partial', () => {
    const code = `
import { ReactFlowProps } from '@xyflow/react'

type $ = Pick<ReactFlowProps, 'ariaLabelConfig'>

export default $`
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "entries": [
          {
            "description": "Configuration for customizable labels, descriptions, and UI text. Provided keys will override the corresponding defaults.
      Allows localization, customization of ARIA descriptions, control labels, minimap labels, and other UI strings.",
            "name": "ariaLabelConfig",
            "optional": true,
            "type": "Partial<AriaLabelConfig>",
          },
        ],
        "name": "$",
      }
    `)
  })

  it('supports @inline tag', () => {
    const code = `
import { ReactFlowInstance } from '@xyflow/react'

type Foo = {
  bar: string
}


/**
 * @inline
 */
type InlineOnType = () => Promise<boolean>;

/**
 * @inline
 * @remarks \`1337\`
 */
type InlineAndRemarksOnType = () => Promise<boolean>;

/**
 * @inline
 */
type InlineParam = {
  baz: string
}

/**
 * @inline
 */
type InlineFunctionParamOnType = (options?: InlineParam) => Promise<boolean>;

type $ = {
  /**
   * @inline
   */
  setViewport: ReactFlowInstance['setViewport']
  /**
   * @inline
   */
  foo: Foo
  bar: InlineOnType
  quz: InlineAndRemarksOnType
  zz: InlineFunctionParamOnType
}

export default $`
    const result = generateDefinition({ code })
    expect(result).toMatchInlineSnapshot(`
      {
        "entries": [
          {
            "name": "setViewport",
            "tags": {
              "inline": "",
            },
            "type": "(viewport: Viewport, options?: {
          duration?: number;
          ease?: (t: number) => number;
          interpolate?: 'smooth' | 'linear';
      }) => Promise<boolean>",
          },
          {
            "name": "foo",
            "tags": {
              "inline": "",
            },
            "type": "{
        bar: string
      }",
          },
          {
            "name": "bar",
            "type": "() => Promise<boolean>",
          },
          {
            "name": "quz",
            "type": "1337",
          },
          {
            "name": "zz",
            "type": "(options?: {
        baz: string
      }) => Promise<boolean>",
          },
        ],
        "name": "$",
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
    const result = generateDefinition({ code })
    const result2 = generateDefinition({
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
