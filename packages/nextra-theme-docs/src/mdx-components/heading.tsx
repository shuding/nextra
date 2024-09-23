import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { HeadingAnchor } from './heading-anchor'

const createHeading = (
  Tag: `h${1 | 2 | 3 | 4 | 5 | 6}`
): FC<ComponentProps<'h1'>> =>
  function Heading({ children, id, className, ...props }) {
    const _class = // can be added by footnotes
      className === 'sr-only'
        ? '_sr-only'
        : cn(
            '_tracking-tight _text-slate-900 dark:_text-slate-100',
            Tag === 'h1' ? '_font-bold' : '_font-semibold',
            {
              h1: '_mt-2 _text-4xl',
              h2: '_mt-10 _border-b _pb-1 _text-3xl _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400',
              h3: '_mt-8 _text-2xl',
              h4: '_mt-8 _text-xl',
              h5: '_mt-8 _text-lg',
              h6: '_mt-8 _text-base'
            }[Tag]
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
