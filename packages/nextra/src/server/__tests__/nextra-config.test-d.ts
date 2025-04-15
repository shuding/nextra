import { expectError, expectType } from 'tsd'

type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false

type Diff<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A
    ? K extends keyof B
      ? IsOptional<A, K> extends IsOptional<B, K>
        ? [A[K]] extends [B[K]]
          ? [B[K]] extends [A[K]]
            ? never
            : K
          : K
        : K
      : K // key in A, but not in B
    : K // key in B, but not in A
}[keyof A | keyof B]

type MissingInA<A, B> = Exclude<keyof B, keyof A>
type MissingInB<A, B> = Exclude<keyof A, keyof B>

type TypeDifference<A, B> = Diff<A, B> | MissingInA<A, B> | MissingInB<A, B>

type AssertExact<A, B> =
  TypeDifference<A, B> extends never
    ? true
    : {
        ERROR: 'Types are not equal'
        DIFF_KEYS: TypeDifference<A, B>
      }

// @ts-expect-error
expectType<AssertExact<{ foo: string }, { foo: number }>>(true)

expectType<AssertExact<{ foo: { bar: string } }, { foo: { bar: number } }>>(true)
