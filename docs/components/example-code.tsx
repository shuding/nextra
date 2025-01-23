import fs from 'node:fs/promises'
import path from 'node:path'
import { compileMdx } from 'nextra/compile'
import type { FC } from 'react'
import { MDXRemote } from '../../packages/nextra/dist/client/mdx-remote'

export const ExampleCode: FC<{
  filePath: string
  metadata: string
  example: string
}> = async ({ filePath, metadata, example }) => {
  const pageContent = await fs.readFile(
    `../examples/${example}/${filePath}`,
    'utf8'
  )
  const ext = path.extname(filePath).slice(1)

  const rawJs = await compileMdx(
    `~~~${ext} filename="${filePath}" showLineNumbers ${metadata}
${pageContent.trim()}
~~~`,
    { defaultShowCopyCode: true }
  )
  return <MDXRemote compiledSource={rawJs} />
}
