import fs from 'node:fs/promises'
import path from 'node:path'
import { generateTsFromZod } from '../nextra/src/server/tsdoc/zod-to-ts'
import { LayoutPropsSchema } from './src/schemas'

await fs.writeFile(
  path.resolve('src', 'types.generated.ts'),
  `export interface LayoutProps ${generateTsFromZod(LayoutPropsSchema)}`
)
