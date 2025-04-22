import type { ReactNode } from 'react'

export function extractStringsFromReactNode(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node))
    return node.map(n => extractStringsFromReactNode(n)).join('')

  const children = (node as any)?.props?.children as ReactNode
  if (!children) return ''
  return extractStringsFromReactNode(children)
}
