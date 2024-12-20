// TODO: check why isn't optimized
'use no memo'

import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { HeadingAnchor } from './heading-anchor.client'

const createHeading = (
  Tag: `h${1 | 2 | 3 | 4 | 5 | 6}`
): FC<ComponentProps<typeof Tag>> =>
  function Heading({ children, id, className, ...props }) {
    const _class = // can be added by footnotes
      className === 'sr-only'
        ? 'x:sr-only'
        : cn(
            'x:tracking-tight x:text-slate-900 x:dark:text-slate-100',
            Tag === 'h1'
              ? 'x:font-bold'
              : 'x:font-semibold x:target:animate-[fade-in_1.5s]',
            {
              h1: 'x:mt-2 x:text-4xl',
              h2: 'x:mt-10 x:border-b x:pb-1 x:text-3xl nextra-border',
              h3: 'x:mt-8 x:text-2xl',
              h4: 'x:mt-8 x:text-xl',
              h5: 'x:mt-8 x:text-lg',
              h6: 'x:mt-8 x:text-base'
            }[Tag],
            className
          )

    return (
      <Tag id={id} className={_class} {...props}>
        {children}
        {id && <HeadingAnchor id={id} />}
      </Tag>
    )
  }

export const H1 = createHeading('h1')
export const H2 = createHeading('h2')
export const H3 = createHeading('h3')
export const H4 = createHeading('h4')
export const H5 = createHeading('h5')
export const H6 = createHeading('h6')
