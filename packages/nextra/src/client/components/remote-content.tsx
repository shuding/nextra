import { useMDXComponents } from 'next-mdx-import-source-file'
import { evaluate } from '../evaluate.js'
import type { Scope } from '../evaluate.js'
import type { MDXComponents } from '../mdx-components.js'

export type RemoteContentProps = {
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * @example `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName>`.
   */
  components?: MDXComponents
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Scope
  compiledSource: string
}

export function RemoteContent({
  scope,
  components,
  compiledSource
}: RemoteContentProps) {
  const MDXContent = evaluate(compiledSource, scope).default

  return <MDXContent components={useMDXComponents(components)} />
}
