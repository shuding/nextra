import type { JSX, ReactElement, ReactNode } from 'react'

type $ = {
  any: any
  unknown: unknown
  array: unknown[]
  boolean: boolean
  string: string
  number: number
  symbol: symbol
  readonlyArray: readonly unknown[]
  tuple: [unknown, unknown]
  function: (a: unknown) => unknown
  map: Map<unknown, unknown>
  readonlyMap: ReadonlyMap<unknown, unknown>
  set: Set<unknown>
  readonlySet: ReadonlySet<unknown>
  weakSet: WeakSet<any>
  weakMap: WeakMap<any, unknown>
  reactElement: ReactElement
  reactNode: ReactNode
  promise: Promise<unknown>
  date: Date
  regex: RegExp
  jsx: JSX.Element
  object: object
  ok: {
    a: {
      b: unknown
    }
  }
}

export default $
