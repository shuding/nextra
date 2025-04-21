import fs from 'node:fs/promises'
import path from 'node:path'
import type { z } from 'zod'
import { HeadPropsSchema } from '../../client/components/head.js'
import type { HeadProps, NextraConfig } from '../../types.generated.js'
import { NextraConfigSchema } from '../schemas.js'
import { generateTsFromZod } from '../tsdoc/zod-to-ts.js'
import type { IsEqual } from './test-utils.js'

await fs.writeFile(
  path.resolve('src', 'types.generated.ts'),
  `export interface NextraConfig ${generateTsFromZod(NextraConfigSchema)}

export interface HeadProps ${generateTsFromZod(HeadPropsSchema)}`
)

describe('Assert types', () => {
  it('foo should be a `string`', () => {
    type $ = IsEqual<{ foo: string }, { foo: number }>
    assertType<$>(false)
  })
  it('foo.bar should be a `string`', () => {
    type $ = IsEqual<{ foo: { bar: string } }, { foo: { bar: number } }>
    assertType<$>(false)
  })
  it('foo should be optional', () => {
    type $ = IsEqual<{ foo?: string }, { foo: string }>
    assertType<$>(false)
  })
  it('foo should be optional, not `undefined`', () => {
    type $ = IsEqual<{ foo?: string }, { foo: string | undefined }>
    assertType<$>(false)
  })
  it('NextraConfig should be identical', () => {
    type NextraConfigFromZod = z.input<typeof NextraConfigSchema>
    type $ = IsEqual<NextraConfigFromZod, NextraConfig>
    assertType<$>(true)
  })
  it('HeadProps should be identical', () => {
    type HeadPropsFromZod = z.input<typeof HeadPropsSchema>
    type $ = IsEqual<HeadPropsFromZod, HeadProps>
    assertType<$>(true)
  })
})
