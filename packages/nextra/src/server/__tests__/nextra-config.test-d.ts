import { expectType } from 'tsd'
import type { z } from 'zod'
import type { HeadPropsSchema } from '../../client/components/head.js'
import type { HeadProps, NextraConfig } from '../../types.generated.js'
import type { NextraConfigSchema } from '../schemas.js'
import type { IsEqual } from './test-utils.js'

type $1 = IsEqual<{ foo: string }, { foo: number }>

// @ts-expect-error -- foo should be a string
expectType<$1>(true)

type $2 = IsEqual<{ foo: { bar: string } }, { foo: { bar: number } }>

// @ts-expect-error -- bar should be a string
expectType<$2>(true)

type $3 = IsEqual<{ foo?: string }, { foo: string }>

// @ts-expect-error -- foo should be optional
expectType<$3>(true)

type $4 = IsEqual<{ foo?: string }, { foo: string | undefined }>

// @ts-expect-error -- foo should be optional, not undefined
expectType<$4>(true)

type NextraConfigFromZod = z.input<typeof NextraConfigSchema>

type $5 = IsEqual<NextraConfigFromZod, NextraConfig>

// Nextra config should be identical
expectType<$5>(true)

type HeadPropsFromZod = z.input<typeof HeadPropsSchema>

type $6 = IsEqual<HeadPropsFromZod, HeadProps>

// Head props should be identical
expectType<$6>(true)
