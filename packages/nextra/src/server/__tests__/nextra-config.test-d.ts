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
    type Expected = z.input<typeof NextraConfigSchema>
    type Actual = NextraConfig
    expectTypeOf<Actual>().toEqualTypeOf<Expected>
  })
  it.skip('HeadProps should be identical', () => {
    // TODO: fix `backgroundColor`
    type Expected = z.input<typeof HeadPropsSchema>
    type Actual = HeadProps
    expectTypeOf<Actual>().toEqualTypeOf<Expected>
  })
})
