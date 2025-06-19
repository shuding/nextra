'use client'

import { useEffect, useState } from 'react'
import type { FC, ReactElement } from 'react'
import { evaluate } from '../evaluate.js'
import type { MDXRemoteProps } from '../mdx-remote.js'
import { Callout } from './callout.js'

type PlaygroundProps = {
  /**
   * String with source MDX.
   * @example '# hello world <br /> nice to see you'
   */
  source: string
  /**
   * Fallback component for loading.
   * @default null
   */
  fallback?: ReactElement | null
} & Pick<MDXRemoteProps, 'components' | 'scope'>

/**
 * A built-in component lets you write Nextra-compatible MDX that renders only on the client.
 * @example
 * <PlaygroundDemo />
 *
 * @usage
 * ```mdx filename="Basic Usage"
 * import { Playground } from 'nextra/components'
 *
 * # Playground
 *
 * Below is a playground component. It mixes into the rest of your MDX perfectly.
 *
 * <Playground
 *   source="## Hello world"
 *   components={{ h2: props => <h2 {...props} className="myClass" /> }}
 * />
 * ```
 *
 * You may also specify a fallback component like so:
 *
 * ```mdx filename="Usage with Fallback"
 * import { Playground } from 'nextra/components'
 *
 * <Playground
 *   source="## Hello world"
 *   components={{ h2: props => <h2 {...props} className="myClass" /> }}
 *   fallback={<div>Loading playground...</div>}
 * />
 * ```
 *
 * ### Avoiding unstyled outputs
 *
 * To prevent unstyled elements, import `useMDXComponents` from your
 * `mdx-components` file. Call this function and pass the returned components to
 * the `components` prop. You can also include your custom components as the first
 * argument:
 *
 * ```mdx {1,6-8}
 * import { Playground } from 'nextra/components'
 * import { useMDXComponents } from '../path/to/my/mdx-components'
 *
 * <Playground
 *   source="## Hello world"
 *   components={useMDXComponents({
 *     h2: props => <h2 {...props} className="myClass" />
 *   })}
 *   fallback={<div>Loading playground...</div>}
 * />
 * ```
 */
export const Playground: FC<PlaygroundProps> = ({
  source,
  fallback = null,
  components,
  scope
}) => {
  const [compiledSource, setCompiledSource] = useState('')
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    async function doCompile() {
      // Importing in useEffect to not increase global bundle size
      const { compileMdx } = await importCompile()
      try {
        const rawJs = await compileMdx(source)
        setCompiledSource(rawJs)
        setError(null)
      } catch (error) {
        setError(error)
      }
    }

    doCompile()
  }, [source])

  if (error) {
    return (
      <Callout type="error">
        <b>Could not compile code</b>
        <br />
        {error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error)}
      </Callout>
    )
  }

  if (compiledSource) {
    // `<MDXRemote>` cannot be used here because `useMDXComponents` may include components that
    // are only available on the server.
    const MDXContent = evaluate(compiledSource, components, scope).default
    return <MDXContent />
  }

  return fallback
}

// Otherwise react-compiler fails
function importCompile() {
  return import('../../server/compile.js')
}
