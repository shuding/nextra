import cn from 'clsx'
import { Code, Pre, Table, Td, Th, Tr, withIcons } from 'nextra/components'
import { ArrowRightIcon } from 'nextra/icons'
import type { MDXComponents } from 'nextra/mdx'
import { DEFAULT_COMPONENTS } from 'nextra/mdx'
import { Details } from './details'
import { H1 } from './h1'
import { H2, H3, H4, H5, H6 } from './heading'
import { Link } from './link'
import { Wrapper } from './wrapper'

export { Link, H1 }

/* eslint sort-keys: error */
export function useMDXComponents<T extends MDXComponents>(components: T) {
  return {
    ...DEFAULT_COMPONENTS,
    a: Link,
    blockquote: props => (
      <blockquote
        className={cn(
          '_mt-6 _border-gray-300 _italic _text-gray-700 dark:_border-gray-700 dark:_text-gray-400',
          'first:_mt-0 _border-s-2 _ps-6'
        )}
        {...props}
      />
    ),
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
      <ol className="_mt-6 _list-decimal first:_mt-0 _ms-6" {...props} />
    ),
    p: props => <p className="_mt-6 _leading-7 first:_mt-0" {...props} />,
    pre: withIcons(Pre),
    summary: ({ children, ...props }) => (
      <summary
        className={cn(
          '_flex _items-center _cursor-pointer _p-1 _transition-colors hover:_bg-gray-100 dark:hover:_bg-neutral-800',
          // display: flex removes whitespace when `<summary />` contains text with other elements, like `foo <strong>bar</strong>`
          '_whitespace-pre-wrap',
          '_select-none'
        )}
        {...props}
      >
        {children}
        <ArrowRightIcon
          className={cn(
            '_order-first', // if prettier formats `summary` it will have unexpected margin-top
            '_size-4 _shrink-0 _mx-1.5',
            'rtl:_rotate-180 [[data-expanded]>summary>&]:_rotate-90 _transition'
          )}
          pathClassName="_stroke-[3px]"
        />
      </summary>
    ),
    table: props => (
      <Table className="nextra-scrollbar _mt-6 _p-0 first:_mt-0" {...props} />
    ),
    td: Td,
    th: Th,
    tr: Tr,
    ul: props => (
      <ul className="_mt-6 _list-disc first:_mt-0 _ms-6" {...props} />
    ),
    wrapper: Wrapper,
    ...components
  } satisfies MDXComponents
}
