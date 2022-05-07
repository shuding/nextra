import ReactDOMServer from 'react-dom/server'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MDXProvider } from '@mdx-js/react'
import Slugger from 'github-slugger'
import Link from 'next/link'
import React from 'react'
import ReactDOM from 'react-dom'

// Anchor links

const SluggerContext = createContext<Slugger | null>(null)

const H1 = () => {
  return null as any
}

const HeaderLink = ({
  tag: Tag,
  children,
  ...props
}: {
  tag: any
  children: any
}) => {
  const slugger = useContext(SluggerContext)
  // @ts-expect-error safe slugger from context
  const slug = slugger.slug(ReactDOMServer.renderToStaticMarkup(children))
  return (
    <Tag {...props}>
      <span className="subheading-anchor" id={slug} />
      <a href={'#' + slug} className="subheading">
        {children}
        <span className="anchor-icon" aria-hidden>
          #
        </span>
      </a>
    </Tag>
  )
}

const H2 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <HeaderLink tag="h2" {...props}>
      {children}
    </HeaderLink>
  )
}

const H3 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <HeaderLink tag="h3" {...props}>
      {children}
    </HeaderLink>
  )
}

const H4 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <HeaderLink tag="h4" {...props}>
      {children}
    </HeaderLink>
  )
}

const H5 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <HeaderLink tag="h5" {...props}>
      {children}
    </HeaderLink>
  )
}

const H6 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <HeaderLink tag="h6" {...props}>
      {children}
    </HeaderLink>
  )
}
const A = ({
  children,
  ...props
}: {
  children?: React.ReactNode
  href?: string
}) => {
  const isExternal = props.href && props.href.startsWith('https://')
  if (isExternal) {
    return (
      <a target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  }
  return props.href ? (
    <Link href={props.href}>
      <a {...props}>{children}</a>
    </Link>
  ) : (
    <></>
  )
}

const Pre = ({
  children
}: {
  children?: React.ReactNode
  href?: string | undefined
}) => {
  return (
    <div className="not-prose">
      <pre>{children}</pre>
    </div>
  )
}
const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: A,
  pre: Pre
}

const MDXTheme: React.FC = ({ children }) => {
  const slugger = new Slugger()
  return (
    <SluggerContext.Provider value={slugger}>
      <MDXProvider components={components}>{children}</MDXProvider>
    </SluggerContext.Provider>
  )
}

export default MDXTheme
