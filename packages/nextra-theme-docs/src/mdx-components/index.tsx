import cn from 'clsx'
import {
  Callout,
  Code,
  Details,
  Pre,
  SkipNavContent,
  Summary,
  Table,
  Td,
  Th,
  Tr,
  withGitHubAlert,
  withIcons
} from 'nextra/components'
import { useMDXComponents as useNextraMDXComponents } from 'nextra/mdx'
import { removeLinks } from 'nextra/remove-links'
import type { ComponentProps, FC } from 'react'
import { Sidebar } from '../components'
import { H1, H2, H3, H4, H5, H6 } from './heading'
import { Link } from './link'
import { ClientWrapper } from './wrapper.client'

const Blockquote: FC<ComponentProps<'blockquote'>> = props => (
  <blockquote
    className={cn(
      '[&:not(:first-child)]:_mt-6 _border-gray-300 _italic _text-gray-700 dark:_border-gray-700 dark:_text-gray-400',
      '_border-s-2 _ps-6'
    )}
    {...props}
  />
)

/* eslint sort-keys: error */
export const useMDXComponents: typeof useNextraMDXComponents = components =>
  useNextraMDXComponents({
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
    hr: props => (
      <hr
        className="_my-8 _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400"
        {...props}
      />
    ),
    li: props => <li className="_my-2" {...props} />,
    ol: props => (
      <ol
        className="[:is(ol,ul)_&]:_my-3 [&:not(:first-child)]:_mt-6 _list-decimal _ms-6"
        {...props}
      />
    ),
    p: props => (
      <p className="[&:not(:first-child)]:_mt-6 _leading-7" {...props} />
    ),
    pre: withIcons(Pre),
    summary: Summary,
    table: ({ className, ...props }) => (
      <Table
        className={cn(
          'nextra-scrollbar [&:not(:first-child)]:_mt-6 _p-0',
          className
        )}
        {...props}
      />
    ),
    td: Td,
    th: Th,
    tr: Tr,
    ul: props => (
      <ul
        className="[:is(ol,ul)_&]:_my-3 [&:not(:first-child)]:_mt-6 _list-disc _ms-6"
        {...props}
      />
    ),
    wrapper({ toc, children, ...props }) {
      // @ts-expect-error fixme
      toc = toc.map(item => ({
        ...item,
        value: removeLinks(item.value)
      }))
      return (
        <div className="_mx-auto _flex _max-w-[90rem]">
          <Sidebar toc={toc} />

          <ClientWrapper toc={toc} {...props}>
            <SkipNavContent />
            <main
              data-pagefind-body={
                (props.metadata as any).searchable !== false || undefined
              }
            >
              {children}
            </main>
          </ClientWrapper>
        </div>
      )
    },
    ...components
  })
