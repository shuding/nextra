import Head from 'next/head'
import React, { ReactNode, useRef } from 'react'
import { useBlogContext } from './blog-context'
import { HeadingContext } from './mdx-theme'

export const BasicLayout = ({ children }: { children: ReactNode }) => {
  const { config, opts } = useBlogContext()
  const title = `${opts.title}${config.titleSuffix || ''}`
  const ref = useRef<HTMLHeadingElement>(null)
  return (
    <article
      className="nx-container nx-prose-sm nx-prose dark:nx-prose-dark md:nx-prose"
      dir="ltr"
    >
      <Head>
        <title>{title}</title>
        {config.head?.({ title, meta: opts.frontMatter })}
      </Head>
      <HeadingContext.Provider value={ref}>
        {opts.hasJsxInH1 ? <h1 ref={ref} /> : null}
        {!opts.hasJsxInH1 ? <h1>{opts.title}</h1> : null}
        {children}
        {config.footer}
      </HeadingContext.Provider>
    </article>
  )
}
