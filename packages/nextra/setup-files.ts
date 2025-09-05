import fs from 'node:fs/promises'
import path from 'node:path'
import { HeadPropsSchema } from './src/client/components/head.js'
import { NextraConfigSchema } from './src/server/schemas.js'
import { generateTsFromZod } from './src/server/tsdoc/zod-to-ts.js'

const rawTs = `export interface NextraConfig ${generateTsFromZod(NextraConfigSchema)}

export interface HeadProps ${generateTsFromZod(HeadPropsSchema)}`

await fs.writeFile(path.resolve('src', 'types.generated.ts'), rawTs)
