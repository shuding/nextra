import fs from 'node:fs/promises'
import path from 'node:path'
import { expectType } from 'vite-plugin-vitest-typescript-assert/tsd'
import type { z } from 'zod'
import type { IsEqual } from '../../../nextra/src/server/__tests__/test-utils.js'
// fixes error from `server-only`
// Error: This module cannot be imported from a Client Component module. It should only be used from a Server Component.
import { generateTsFromZod } from '../../../nextra/src/server/tsdoc/zod-to-ts'
import { LayoutPropsSchema } from '../schemas'
import type { LayoutProps } from '../types.generated'

await fs.writeFile(
  path.resolve('src', 'types.generated.ts'),
  `export interface LayoutProps ${generateTsFromZod(LayoutPropsSchema)}`
)

describe('Assert types', () => {
  type LayoutPropsFromZod = z.input<typeof LayoutPropsSchema>

  type $1 = IsEqual<LayoutPropsFromZod, LayoutProps>
  test('Layout props should be identical', () => {
    expectType<$1>(true)
  })
})
