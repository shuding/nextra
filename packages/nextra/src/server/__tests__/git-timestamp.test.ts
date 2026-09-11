import path from 'node:path'
import type { LoaderContext } from 'webpack'
import type { LoaderOptions } from '../../types.js'
import { NextraConfigSchema } from '../schemas.js'

vi.mock('next/dist/lib/find-pages-dir.js', () => ({
  findPagesDir: () => ({ appDir: process.cwd() })
}))

async function compileWithLoader(
  source: string,
  {
    gitTimestamp,
    filePath
  }: {
    gitTimestamp?: boolean
    filePath: string
  }
): Promise<string> {
  const { loader } = await import('../loader.js')
  const options = NextraConfigSchema.parse(
    gitTimestamp === undefined ? {} : { gitTimestamp }
  )
  return loader.call(
    {
      getOptions: () => options,
      resourcePath: filePath,
      resourceQuery: ''
    } as LoaderContext<LoaderOptions>,
    source
  )
}

it('parses gitTimestamp: false', () => {
  expect(NextraConfigSchema.parse({ gitTimestamp: false }).gitTimestamp).toBe(
    false
  )
})

it('defaults gitTimestamp to true', () => {
  expect(NextraConfigSchema.parse({}).gitTimestamp).toBe(true)
})

it('omits metadata.timestamp when gitTimestamp is false', async () => {
  const result = await compileWithLoader('# Hello', {
    gitTimestamp: false,
    filePath: path.join(process.cwd(), 'disabled.mdx')
  })
  expect(result).not.toMatch(/"timestamp":/)
})

it('includes metadata.timestamp by default', async () => {
  const result = await compileWithLoader('# Hello', {
    filePath: path.join(process.cwd(), 'enabled.md')
  })
  expect(result).toMatch(/"timestamp":\s*\d+/)
})
