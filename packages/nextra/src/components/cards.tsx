import cn from 'clsx'
import NextLink from 'next/link'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'

const classes = {
  cards: cn(
    'nextra-cards nx-mt-4 nx-gap-4 nx-grid',
    'nx-not-prose' // for nextra-theme-docs
  ),
  card: cn(
    'nextra-card nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200',
    'nx-text-current nx-no-underline dark:nx-shadow-none',
    'hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100',
    'active:nx-shadow-sm active:nx-shadow-gray-200',
    'nx-transition-all nx-duration-200 hover:nx-border-gray-300'
  ),
  title: cn(
    'nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900'
  ),
  description: cn(
    'nx-flex nx-items-start nx-gap-2 nx-pb-4 nx-px-4 nx-text-sm nx-text-gray-600 group-hover:nx-text-gray-600 nx-duration-75 nx-transition-colors'
  )
}

const arrowEl = (
  <span className="nx-transition-transform nx-duration-75 group-hover:nx-translate-x-[2px]">
    →
  </span>
)

export function Card({
  children,
  title,
  description,
  icon,
  image,
  arrow,
  href,
  ...props
}: {
  children: ReactNode
  title: string
  description?: string
  icon: ReactNode
  image?: boolean
  arrow?: boolean
  href: string
}) {
  const animatedArrow = arrow ? arrowEl : null

  if (image) {
    return (
      <NextLink
        href={href}
        className={cn(
          classes.card,
          'nx-bg-gray-100 nx-shadow dark:nx-border-neutral-700 dark:nx-bg-neutral-800 dark:nx-text-gray-50 hover:nx-shadow-lg dark:hover:nx-border-neutral-500 dark:hover:nx-bg-neutral-700'
        )}
        {...props}
      >
        {children}
        <span
          className={cn(
            classes.title,
            'dark:nx-text-gray-300 dark:hover:nx-text-gray-100',
            {
              "nx-pb-0": description,
            }
          )}
        >
          {icon}
          <span className="nx-flex nx-gap-1">
            {title}
            {animatedArrow}
          </span>

          {description && (
            <p className={cn(
              classes.description,
              'dark:nx-text-neutral-400 dark:group-hover:nx-text-neutral-100 nx-flex nx-items-center'
            )}>
              {description}
            </p>
          )}
        </span>
      </NextLink>
    )
  }

  return (
    <NextLink
      href={href}
      className={cn(
        classes.card,
        'nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900'
      )}
      {...props}
    >
      <span
        className={cn(
          classes.title,
          'dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50',
          {
            "nx-pb-0": description,
          }
        )}
      >
        {icon}
        {title}
        {animatedArrow}
      </span>

      {description && (
        <p className={cn(
          classes.description,
          'dark:nx-text-neutral-400 dark:group-hover:nx-text-neutral-100 nx-flex nx-items-center'
        )}>
          {description}
        </p>
      )}
    </NextLink>
  )
}

export function Cards({
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