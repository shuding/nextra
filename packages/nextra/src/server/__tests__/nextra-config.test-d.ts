import type { z } from 'zod'
import { HeadPropsSchema } from '../../client/components/head.js'
import type { HeadProps, NextraConfig } from '../../types.generated.js'
import { NextraConfigSchema } from '../schemas.js'
import type { IsEqual } from './test-utils.js'

describe('Assert types', () => {
  it('foo should be a `string`', () => {
    type Expected = { foo: string }
    type Actual = { foo: number }
    assertType<IsEqual<Expected, Actual>>(false)
    expectTypeOf<Actual>().not.toEqualTypeOf<Expected>
  })
  it('foo.bar should be a `string`', () => {
    type Expected = { foo: { bar: string } }
    type Actual = { foo: { bar: number } }
    assertType<IsEqual<Expected, Actual>>(false)
    expectTypeOf<Actual>().not.toEqualTypeOf<Expected>
  })
  it('foo should be optional', () => {
    type Expected = { foo?: string }
    type Actual = { foo: string }
    assertType<IsEqual<Expected, Actual>>(false)
    expectTypeOf<Actual>().not.toEqualTypeOf<Expected>
  })
  it('foo should be optional, not `undefined`', () => {
    type Expected = { foo?: string }
    type Actual = { foo: string | undefined }
    assertType<IsEqual<Expected, Actual>>(false)
    expectTypeOf<Actual>().not.toEqualTypeOf<Expected>
  })
  it('NextraConfig should be identical', () => {
    type NextraConfigFromZod = z.input<typeof NextraConfigSchema>
    expectTypeOf<NextraConfig>().toEqualTypeOf<NextraConfigFromZod>
  })
  it('HeadProps should be identical', () => {
    type HeadPropsFromZod = z.input<typeof HeadPropsSchema>
    expectTypeOf<HeadProps>().toEqualTypeOf<HeadPropsFromZod>
  })
})
