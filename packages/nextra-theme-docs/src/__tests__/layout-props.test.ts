// vi.mock('server-only', () => {
//   console.log('inside')
//   return {
//     // mock server-only module
//   }
// })
window.IntersectionObserver = vi.fn()
import fs from 'node:fs/promises'
import path from 'node:path'
// fixes
// Error: This module cannot be imported from a Client Component module. It should only be used from a Server Component.
//  ❯ Object.<anonymous> ../../node_modules/.pnpm/server-only@0.0.1/node_modules/server-only/index.js:1:7
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts'
import { expectType } from 'vite-plugin-vitest-typescript-assert/tsd'
import type { z } from 'zod'
import type { IsEqual } from '../../../nextra/src/server/__tests__/test-utils.js'
import { LayoutPropsSchema } from '../schemas'
import type { LayoutProps } from '../types.generated'

async function start(): Promise<void> {
  await fs.writeFile(
    path.resolve('src', 'types.generated.ts'),
    `export interface LayoutProps ${generateTsFromZod(LayoutPropsSchema)}`
  )
}

start()

describe('Assert types', () => {
  type LayoutPropsFromZod = z.input<typeof LayoutPropsSchema>

  type $1 = IsEqual<LayoutPropsFromZod, LayoutProps>
  test('Layout props should be identical', () => {
    expectType<$1>(true)
  })
})
