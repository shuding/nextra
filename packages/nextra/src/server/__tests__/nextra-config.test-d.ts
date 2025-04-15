import { expectType } from 'tsd'

type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false

type FieldMismatchReport<A, B> = {
  [K in keyof A | keyof B as K extends keyof A
    ? K extends keyof B
      ? IsOptional<A, K> extends IsOptional<B, K>
        ? [A[K]] extends [B[K]]
          ? [B[K]] extends [A[K]]
            ? never
            : K
          : K
        : K
      : K
    : K]: {
    actual: K extends keyof A ? A[K] : never
    expected: K extends keyof B ? B[K] : never
  }
}

type TypeDifferenceDetails<A, B> = keyof FieldMismatchReport<A, B> extends never
  ? never
  : FieldMismatchReport<A, B>

type AssertExact<A, B> =
  TypeDifferenceDetails<A, B> extends never
    ? true
    : {
        ERROR: 'Types are not equal'
        DETAILS: TypeDifferenceDetails<A, B>
      }

type $1 = AssertExact<{ foo: string }, { foo: number }>

// @ts-expect-error -- foo should be a string
expectType<$1>(true)

type $2 = AssertExact<{ foo: { bar: string } }, { foo: { bar: number } }>

// @ts-expect-error -- bar should be a string
expectType<$2>(true)

type $3 = AssertExact<{ foo?: string }, { foo: string }>

// @ts-expect-error -- foo should be optional
expectType<$3>(true)
