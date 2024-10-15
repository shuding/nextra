import cn from 'clsx'
import {
  Callout,
  Code,
  Details,
  Pre,
  Summary,
  Table,
  Td,
  Th,
  Tr,
  withGitHubAlert,
  withIcons
} from 'nextra/components'
import type { MDXComponents } from 'nextra/mdx'
import { DEFAULT_COMPONENTS } from 'nextra/mdx'
import type { ComponentProps, FC } from 'react'
import { H1, H2, H3, H4, H5, H6 } from './heading'
import { Link } from './link'
import { Wrapper } from './wrapper'

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
export function useMDXComponents(components?: any) {
  return {
    ...DEFAULT_COMPONENTS,
    a: Link,
    blockquote: withGitHubAlert(Blockquote, ({ type, ...props }) => {
      const calloutType = (
        {
          note: 'info',
          tip: 'default',
          important: 'error', // TODO
          warning: 'warning',
          caution: 'error'
        } as const
      )[type]

      return <Callout type={calloutType} {...props} />
    }),
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
    wrapper: Wrapper,
    ...components
  } satisfies MDXComponents
}
