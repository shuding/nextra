'use client'

import { useEffect, useState } from 'react'
import type { FC, ReactElement } from 'react'
import { evaluate } from '../evaluate.js'
import { CrossCircledIcon } from '../icons/index.js'
import { Code } from '../mdx-components/code.js'
import { Pre } from '../mdx-components/pre/index.js'
import type { MDXRemoteProps } from '../mdx-remote.js'

export const Playground: FC<
  {
    /**
     * String with source MDX
     *
     * @example '# hello world <br /> nice to see you'
     */
    source: string
    /**
     * Fallback component for loading
     */
    fallback?: ReactElement | null
  } & Pick<MDXRemoteProps, 'components' | 'scope'>
> = ({ source, fallback = null, components, scope }) => {
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
      <div className="x:[&_svg]:text-red-500">
        <Pre
          data-filename="Could not compile code"
          icon={<CrossCircledIcon height="16" className="x:shrink-0" />}
          className="x:whitespace-pre-wrap"
        >
          <Code>
            <span>
              {error instanceof Error
                ? `${error.name}: ${error.message}`
                : String(error)}
            </span>
          </Code>
        </Pre>
      </div>
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
