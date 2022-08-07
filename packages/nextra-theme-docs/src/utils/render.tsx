import React, { FC, ReactNode } from 'react'

// Forbid to have `locale` prop
// since it can be retrieved via `const { locale } = useRouter()` call
type WithoutLocale<T> = T & { locale?: never }

export function renderComponent<T>(
  ComponentOrNode: FC<WithoutLocale<T>> | ReactNode,
  props?: T
) {
  if (!ComponentOrNode) return null
  if (typeof ComponentOrNode !== 'function') return ComponentOrNode
  // @ts-expect-error TS2322: Type '{}' is not assignable to type 'T'
  return <ComponentOrNode {...props} />
}

export function renderString<T>(
  stringOrFunction?: string | ((props: WithoutLocale<T>) => string),
  props: T = {} as any
): string {
  const result =
    typeof stringOrFunction === 'function'
      ? stringOrFunction(props)
      : stringOrFunction
  return result || ''
}
