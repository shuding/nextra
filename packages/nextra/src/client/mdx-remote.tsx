import { useMDXComponents } from 'next-mdx-import-source-file'
import type { FC } from 'react'
import { evaluate } from './evaluate.js'
import type { Scope } from './evaluate.js'
import type { MDXComponents } from './mdx-components.js'

export type MDXRemoteProps = Readonly<{
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * @example
   * `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName>`.
   */
  components?: MDXComponents
  /**
   * Pass-through variables for use in the MDX content.
   * These variables will be available in the MDX scope.
   */
  scope?: Scope
  /**
   * Raw JavaScript compiled MDX source code, a result of Nextra's
   * [`compileMdx` function](https://nextra.site/api/compilemdx).
   */
  compiledSource: string
}>

/**
 * A React component that renders compiled MDX content.
 *
 * @returns A rendered React element that renders the MDX content.
 * @example
 * ```mdx filename="example.mdx"
 * import { compileMdx } from 'nextra/compile'
 * import { MDXRemote } from 'nextra/mdx-remote'
 *
 * <MDXRemote
 *   compiledSource={await compileMdx('# Hello {myVariable} <MyComponent />')}
 *   components={{ MyComponent: () => <div>My Component</div> }}
 *   scope={{ myVariable: 'World' }}
 * />
 * ```
 */
export const MDXRemote: FC<MDXRemoteProps> = ({
  scope,
  components,
  compiledSource
}) => {
  const MDXContent = evaluate(
    compiledSource,
    useMDXComponents(components),
    scope
  ).default

  return <MDXContent />
}
