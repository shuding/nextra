import cn from 'clsx'
import NextLink from 'next/link'
import type { ComponentProps, FC, ReactElement, ReactNode } from 'react'

const Card: FC<{
  title: string
  icon?: ReactElement
  arrow?: boolean
  href: string
  children?: ReactNode
  className?: string
}> = ({ children, title, icon, arrow, href, className, ...props }) => {
  return (
    <NextLink
      href={href}
      className={cn(
        'x:group',
        'x:focus-visible:nextra-focus nextra-card x:flex x:flex-col x:justify-start x:overflow-hidden x:rounded-lg x:border x:border-gray-200',
        'x:text-current x:no-underline x:dark:shadow-none',
        'x:hover:shadow-gray-100 x:dark:hover:shadow-none x:shadow-gray-100',
        'x:active:shadow-sm x:active:shadow-gray-200',
        'x:transition-all x:duration-200 x:hover:border-gray-300',
        children
          ? 'x:bg-gray-100 x:shadow x:dark:border-neutral-700 x:dark:bg-neutral-800 x:dark:text-gray-50 x:hover:shadow-lg x:dark:hover:border-neutral-500 x:dark:hover:bg-neutral-700'
          : 'x:bg-transparent x:shadow-sm x:dark:border-neutral-800 x:hover:bg-slate-50 x:hover:shadow-md x:dark:hover:border-neutral-700 x:dark:hover:bg-neutral-900',
        className
      )}
      {...props}
    >
      {children}
      <span
        className={cn(
          'x:flex x:font-semibold x:items-center x:gap-2 x:p-4 x:text-gray-700 x:hover:text-gray-900',
          arrow && [
            'x:after:content-["→"] x:after:transition-transform x:after:duration-75',
            'x:group-hover:after:translate-x-0.5',
            'x:group-focus:after:translate-x-0.5'
          ],
          children
            ? 'x:dark:text-gray-300 x:dark:hover:text-gray-100'
            : 'x:dark:text-neutral-200 x:dark:hover:text-neutral-50'
        )}
        title={title}
      >
        {icon}
        <span className="_truncate">{title}</span>
      </span>
    </NextLink>
  )
}

const _Cards: FC<{ num?: number } & ComponentProps<'div'>> = ({
  children,
  num = 3,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(
        'nextra-cards x:mt-4 x:gap-4 x:grid',
        'not-prose', // for nextra-theme-blog
        className
      )}
      {...props}
      style={{
        ...style,
        ['--rows' as string]: num
      }}
    >
      {children}
    </div>
  )
}

export const Cards = Object.assign(_Cards, { displayName: 'Cards', Card })
