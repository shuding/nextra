import Head from 'next/head'
import React, { ReactNode, useEffect } from 'react'
import { useBlogContext } from './blog-context'
import { HeadingContext } from './mdx-theme'
import { getTitle } from './utils/title'

export const BasicLayout = ({ children }: { children: ReactNode }) => {
  const { config, opts } = useBlogContext()
  const { title, pageTitle } = getTitle({ config, opts })
  const ref = React.useRef<HTMLHeadingElement>(null)
  const { hasJsxInH1 } = opts
  const portalHeading = hasJsxInH1
  return (
    <article className="container prose prose-sm dark:prose-dark md:prose">
      <Head>
        <title>{title}</title>
        {config.head?.({ title, meta: opts.meta })}
      </Head>
      <HeadingContext.Provider value={ref}>
        {portalHeading ? <h1 ref={ref} /> : null}
        {!portalHeading ? <h1>{pageTitle}</h1> : null}
        {children}
        {config.footer}
      </HeadingContext.Provider>
    </article>
  )
}
