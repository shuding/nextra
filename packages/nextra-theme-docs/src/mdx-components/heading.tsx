import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { HeadingAnchor } from './heading-anchor'

const createHeading = (Tag: `h${2 | 3 | 4 | 5 | 6}`) =>
  function Heading({
    children,
    id,
    className,
    ...props
  }: ComponentProps<'h2'>): ReactElement {
    return (
      <Tag
        id={id}
        className={
          // can be added by footnotes
          className === 'sr-only'
            ? '_sr-only'
            : cn(
                '_font-semibold _tracking-tight _text-slate-900 dark:_text-slate-100',
                {
                  h2: '_mt-10 _border-b _pb-1 _text-3xl _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400',
                  h3: '_mt-8 _text-2xl',
                  h4: '_mt-8 _text-xl',
                  h5: '_mt-8 _text-lg',
                  h6: '_mt-8 _text-base'
                }[Tag]
              )
        }
        {...props}
      >
        {children}
        {id && <HeadingAnchor id={id} />}
      </Tag>
    )
  }

export const H2 = createHeading('h2')
export const H3 = createHeading('h3')
export const H4 = createHeading('h4')
export const H5 = createHeading('h5')
export const H6 = createHeading('h6')
