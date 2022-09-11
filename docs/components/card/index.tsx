import cn from 'clsx'
import Link from 'next/link'

import styles from './style.module.css'

export function Card({ children, title, icon, image, arrow, href, ...props }) {
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
      <Link href={href}>
        <a
          className={cn(
            styles.card,
            'group flex flex-col justify-start text-current rounded-lg overflow-hidden shadow shadow-gray-200 border border-transparent bg-gray-100 no-underline transition-all duration-200',
            'hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200'
          )}
          {...props}
        >
          {children}
          <span
            className={cn(
              styles.title,
              'p-4 text-gray-700 gap-1',
              'hover:text-gray-900'
            )}
          >
            {icon}
            {title}
            {animatedArrow}
          </span>
        </a>
      </Link>
    )
  }

  return (
    <Link href={href}>
      <a
        className={cn(
          styles.card,
          'group flex flex-col justify-start text-current rounded-lg overflow-hidden shadow shadow-transparent border border-transparent bg-gray-100 no-underline transition-all duration-200',
          'hover:border-gray-200 hover:shadow-md hover:shadow-gray-100'
        )}
        {...props}
      >
        <span
          className={cn(
            styles.title,
            'p-4 text-gray-700 gap-1',
            'hover:text-gray-900'
          )}
        >
          {icon}
          {title}
          {animatedArrow}
        </span>
      </a>
    </Link>
  )
}

export function Cards({ children, ...props }) {
  return (
    <div className={cn(styles.cards, 'gap-4 mt-4')} {...props}>
      {children}
    </div>
  )
}
