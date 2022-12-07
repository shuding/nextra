import cn from 'clsx'
import Link from 'next/link'

import styles from './style.module.css'

export function Card({
  children,
  title,
  icon,
  image,
  arrow,
  demo,
  href,
  ...props
}) {
  const animatedArrow = arrow ? (
    <span
      className={cn(
        'transition-transform duration-75',
        'group-hover:translate-x-[2px]'
      )}
    >
      →
    </span>
  ) : null

  if (image) {
    return (
      <Link
        href={href}
        className={cn(
          styles.card,
          'group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 bg-gray-100 text-current no-underline shadow shadow-gray-100 transition-all duration-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-50 dark:shadow-none',
          'hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 dark:hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:shadow-none',
          'active:shadow-sm active:shadow-gray-200'
        )}
        {...props}
      >
        {children}
        <span
          className={cn(
            styles.title,
            'gap-2 p-4 text-gray-700 dark:text-gray-300',
            'hover:text-gray-900 dark:hover:text-gray-100'
          )}
        >
          {icon}
          <span className="flex gap-1">
            {title}
            {animatedArrow}
          </span>
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        styles.card,
        'group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 bg-transparent text-current no-underline shadow-sm shadow-gray-100 transition-all duration-200 dark:border-neutral-800 dark:shadow-none',
        'hover:border-gray-300 hover:bg-slate-50 hover:shadow-md hover:shadow-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:shadow-none',
        'active:shadow-sm active:shadow-gray-200'
      )}
      {...props}
    >
      <span
        className={cn(
          styles.title,
          'gap-2 p-4 text-gray-700 dark:text-neutral-200',
          'hover:text-gray-900 dark:hover:text-neutral-50'
        )}
      >
        {icon}
        {title}
        {animatedArrow}
      </span>
    </Link>
  )
}

export function Cards({ children, num, ...props }) {
  return (
    <div
      className={cn(styles.cards, 'mt-4 gap-4')}
      {...props}
      style={
        {
          '--rows': num || 3,
          ...props.style
        } as any
      }
    >
      {children}
    </div>
  )
}
