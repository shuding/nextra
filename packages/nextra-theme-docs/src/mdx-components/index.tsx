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
import type { MDXComponents } from 'nextra/mdx-components'
import { removeLinks } from 'nextra/remove-links'
import type { ComponentProps, FC } from 'react'
import { Sidebar } from '../components'
import { TOCProvider } from '../stores'
import { H1, H2, H3, H4, H5, H6 } from './heading'
import { Link } from './link'
import { ClientWrapper } from './wrapper.client'

const Blockquote: FC<ComponentProps<'blockquote'>> = props => (
  <blockquote
    className={cn(
      'x:not-first:mt-6 x:border-gray-300 x:italic x:text-gray-700 x:dark:border-gray-700 x:dark:text-gray-400',
      'x:border-s-2 x:ps-6'
    )}
    {...props}
  />
)

const DEFAULT_COMPONENTS = getNextraMDXComponents({
  a: Link,
  blockquote: withGitHubAlert(({ type, ...props }) => {
    const calloutType = (
      {
        caution: 'error',
        important: 'error', // TODO
        note: 'info',
        tip: 'default',
        warning: 'warning'
      } as const
    )[type]

    return <Callout type={calloutType} {...props} />
  }, Blockquote),
  code: Code,
  details: Details,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: props => <hr className="x:my-8 nextra-border" {...props} />,
  li: props => <li className="x:my-2" {...props} />,
  ol: props => (
    <ol
      className="x:[:is(ol,ul)_&]:my-3 x:not-first:mt-6 x:list-decimal x:ms-6"
      {...props}
    />
  ),
  p: props => <p className="x:not-first:mt-6 x:leading-7" {...props} />,
  pre: withIcons(Pre),
  summary: Summary,
  table: ({ className, ...props }) => (
    <Table
      className={cn('nextra-scrollbar x:not-first:mt-6 x:p-0', className)}
      {...props}
    />
  ),
  td: Table.Td,
  th: Table.Th,
  tr: Table.Tr,
  ul: props => (
    <ul
      className="x:[:is(ol,ul)_&]:my-3 x:not-first:mt-6 x:list-disc x:ms-6"
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

export const useMDXComponents = (components?: Readonly<MDXComponents>) => {
  return {
    ...DEFAULT_COMPONENTS,
    ...components
  } satisfies MDXComponents
}
