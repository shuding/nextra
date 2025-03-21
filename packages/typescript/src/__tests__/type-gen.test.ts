import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { TypescriptConfig } from '@/get-project'
import { createProcessor } from '@mdx-js/mdx'
import { expect, test } from 'vitest'
import type { RemarkAutoTypeTableOptions } from '../index.js'
import { generateDocumentation, remarkAutoTypeTable } from '../index.js'

const relative = (s: string): string =>
  path.resolve(fileURLToPath(new URL(s, import.meta.url)))

const tsconfig: TypescriptConfig = {
  tsconfigPath: relative('../../tsconfig.json'),
  basePath: relative('../')
}

test('Run', async () => {
  const file = relative('./fixtures/test.ts')
  const content = await fs.readFile(file, 'utf8')

  const result = ['Test1', 'Test2', 'Test3'].flatMap(name =>
    generateDocumentation(file, name, content, {
      config: tsconfig
    })
  )

  await expect(JSON.stringify(result, null, 2) + '\n').toMatchFileSnapshot(
    './fixtures/test.output.json'
  )
})

test('Run on MDX files', async () => {
  const file = relative('./fixtures/test.mdx')
  const processor = createProcessor({
    remarkPlugins: [
      [
        remarkAutoTypeTable,
        {
          options: {
            config: tsconfig
          }
        } satisfies RemarkAutoTypeTableOptions
      ]
    ]
  })

  const output = await processor.process({
    path: file,
    value: await fs.readFile(file, 'utf8')
  })
  await expect(String(output.value)).toMatchFileSnapshot(
    './fixtures/test.output.js'
  )
})
