import cn from 'clsx'
import NextLink from 'next/link'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'

const classes = {
  cards: cn(
    'nextra-cards _mt-4 _gap-4 _grid',
    '_not-prose' // for nextra-theme-blog
  ),
  card: cn(
    'nextra-card _group _flex _flex-col _justify-start _overflow-hidden _rounded-lg _border _border-gray-200',
    '_text-current _no-underline dark:_shadow-none',
    'hover:_shadow-gray-100 dark:hover:_shadow-none _shadow-gray-100',
    'active:_shadow-sm active:_shadow-gray-200',
    '_transition-all _duration-200 hover:_border-gray-300'
  ),
  title: cn(
    '_flex _font-semibold _items-start _gap-2 _p-4 _text-gray-700 hover:_text-gray-900'
  )
}

const arrowEl = (
  <span className="_transition-transform _duration-75 group-hover:_translate-x-[2px]">
    →
  </span>
)

function Card({
  children,
  title,
  icon,
  image,
  arrow,
  href,
  ...props
}: {
  title: string
  icon: ReactNode
  arrow?: boolean
  href: string
} & (
  | {
      children?: never
      image?: false
    }
  | {
      children: ReactNode
      image: true
    }
)) {
  const animatedArrow = arrow ? arrowEl : null

  if (image) {
    return (
      <NextLink
        href={href}
        className={cn(
          classes.card,
          '_bg-gray-100 _shadow dark:_border-neutral-700 dark:_bg-neutral-800 dark:_text-gray-50 hover:_shadow-lg dark:hover:_border-neutral-500 dark:hover:_bg-neutral-700'
        )}
        {...props}
      >
        {children}
        <span
          className={cn(
            classes.title,
            'dark:_text-gray-300 dark:hover:_text-gray-100'
          )}
        >
          {icon}
          <span className="_flex _gap-1">
            {title}
            {animatedArrow}
          </span>
        </span>
      </NextLink>
    )
  }

  return (
    <NextLink
      href={href}
      className={cn(
        classes.card,
        '_bg-transparent _shadow-sm dark:_border-neutral-800 hover:_bg-slate-50 hover:_shadow-md dark:hover:_border-neutral-700 dark:hover:_bg-neutral-900'
      )}
      {...props}
    >
      <span
        className={cn(
          classes.title,
          'dark:_text-neutral-200 dark:hover:_text-neutral-50 _flex _items-center'
        )}
      >
        {icon}
        {title}
        {animatedArrow}
      </span>
    </NextLink>
  )
}

function _Cards({
  children,
  num = 3,
  className,
  style,
  ...props
}: { num?: number } & ComponentProps<'div'>) {
  return (
    <div
      className={cn(classes.cards, className)}
      {...props}
      style={
        {
          ...style,
          '--rows': num
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

export const Cards = Object.assign(_Cards, { displayName: 'Cards', Card })
