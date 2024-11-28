'use client'

import { Code, Mermaid, Playground, Pre, Tabs } from 'nextra/components'
import { MdxIcon } from 'nextra/icons'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMDXComponents } from '../../../../mdx-components'

export const Demo: FC = () => {
  const [rawMdx, setRawMdx] =
    useState(`Playground components allow you to write Nextra compatible MDX that renders only on the client. It's modeled after the functionality found in [MDX Playground](https://mdxjs.com/playground).

In some instances where remote loading MDX is not an option, this may work as a great alternative.

Here's an example of a codeblock.

\`\`\`ts
console.log("Hello world, this is a playground component!");
\`\`\`

## Caveats

Due to the purely client-side nature of this component, features "Table of Contents" and "Frontmatter" will not work.

## Mermaid Example

\`\`\`mermaid
graph TD
subgraph AA [Consumers]
A[Mobile App]
B[Web App]
C[Node.js Client]
end
subgraph BB [Services]
E[REST API]
F[GraphQL API]
G[SOAP API]
end
Z[GraphQL API]
A --> Z
B --> Z
C --> Z
Z --> E
Z --> F
Z --> G
\`\`\``)
  const handleInput = useCallback(e => {
    setRawMdx(e.currentTarget.textContent ?? '')
  }, [])

  const spanRef = useRef<HTMLSpanElement>(null!)
  const initialRender = useRef(false)

  useEffect(() => {
    if (!initialRender.current) {
      initialRender.current = true
      spanRef.current.textContent = rawMdx
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  return (
    <div className="mt-6 grid grid-cols-1 gap-2 lg:grid-cols-2">
      <Pre
        data-filename="MDX"
        icon={<MdxIcon height="16" className="shrink-0" />}
      >
        <Code>
          <span
            ref={spanRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none"
            onInput={handleInput}
          />
        </Code>
      </Pre>
      <div>
        <Playground
          fallback={
            <div className="flex h-full items-center justify-center text-4xl">
              Loading playground...
            </div>
          }
          source={rawMdx}
          components={useMDXComponents({ Mermaid, $Tabs: Tabs })}
        />
      </div>
    </div>
  )
}
