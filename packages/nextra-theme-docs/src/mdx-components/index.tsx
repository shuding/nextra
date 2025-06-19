// TODO: check why components in object aren't optimized
'use no memo'

/* eslint sort-keys: error */
import cn from 'clsx'
import {
  Callout,
  Code,
  Details,
  Pre,
  SkipNavContent,
  Summary,
  Table,
  withGitHubAlert,
  withIcons
} from 'nextra/components'
import { useMDXComponents as getNextraMDXComponents } from 'nextra/mdx-components'
import type { UseMDXComponents } from 'nextra/mdx-components'
import { removeLinks } from 'nextra/remove-links'
import type { FC, HTMLAttributes } from 'react'
import { Sidebar } from '../components'
import { TOCProvider } from '../stores'
import { H1, H2, H3, H4, H5, H6 } from './heading'
import { Link } from './link'
import { ClientWrapper } from './wrapper.client'

const Blockquote: FC<HTMLAttributes<HTMLQuoteElement>> = props => (
  <blockquote
    className={cn(
      'x:not-first:mt-[1.25em] x:border-gray-300 x:italic x:text-gray-700 x:dark:border-gray-700 x:dark:text-gray-400',
      'x:border-s-2 x:ps-[1.5em]'
    )}
    {...props}
  />
)

const CALLOUT_TYPE = Object.freeze({
  caution: 'error',
  important: 'important',
  note: 'info',
  tip: 'default',
  warning: 'warning'
})

const DEFAULT_COMPONENTS = getNextraMDXComponents({
  a: Link,
  blockquote: withGitHubAlert(
    ({ type, ...props }) => <Callout type={CALLOUT_TYPE[type]} {...props} />,
    Blockquote
  ),
  code: Code,
  details: Details,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: props => <hr className="x:my-[2em] nextra-border" {...props} />,
  li: props => <li className="x:my-[.5em]" {...props} />,
  ol: props => (
    <ol
      className="x:[:is(ol,ul)_&]:my-[.75em] x:not-first:mt-[1.25em] x:list-decimal x:ms-6"
      {...props}
    />
  ),
  p: props => <p className="x:not-first:mt-[1.25em] x:leading-7" {...props} />,
  pre: withIcons(Pre),
  summary: Summary,
  table: ({ className, ...props }) => (
    <Table
      className={cn(
        'nextra-scrollbar x:not-first:mt-[1.25em] x:p-0',
        className
      )}
      {...props}
    />
  ),
  td: Table.Td,
  th: Table.Th,
  tr: Table.Tr,
  ul: props => (
    <ul
      className="x:[:is(ol,ul)_&]:my-[.75em] x:not-first:mt-[1.25em] x:list-disc x:ms-[1.5em]"
      {...props}
    />
  ),
  wrapper({ toc, children, metadata, bottomContent, ...props }) {
    // @ts-expect-error fixme
    toc = toc.map(item => ({
      ...item,
      value: removeLinks(item.value)
    }))
    return (
      <div
        className="x:mx-auto x:flex x:max-w-(--nextra-content-width)"
        // Attach user-defined props to wrapper container, e.g. `data-pagefind-filter`
        {...props}
      >
        <TOCProvider value={toc}>
          <Sidebar />
          <ClientWrapper metadata={metadata} bottomContent={bottomContent}>
            <SkipNavContent />
            <main
              data-pagefind-body={
                (metadata as any).searchable !== false || undefined
              }
            >
              {children}
            </main>
          </ClientWrapper>
        </TOCProvider>
      </div>
    )
  }
})

export const useMDXComponents: UseMDXComponents<typeof DEFAULT_COMPONENTS> = <
  T,
>(
  components?: T
) => {
  return {
    ...DEFAULT_COMPONENTS,
    ...components
  }
}
