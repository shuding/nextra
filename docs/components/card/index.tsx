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
      <Link href={href}>
        <a
          className={cn(
            styles.card,
            'flex flex-col justify-start text-current rounded-lg overflow-hidden text-gray-500 shadow-md shadow-gray-100 border border-gray-200 bg-gray-100 no-underline transition-all duration-300',
            'hover:border-gray-200 hover:shadow-lg hover:bg-gray-50 hover:shadow-gray-200 hover:text-gray-900'
          )}
          {...props}
        >
          {children}
          <span className={cn(styles.title, 'p-4 gap-2 text-current')}>
            {icon}
            <span className="flex gap-1">
              {title}
              {animatedArrow}
            </span>
          </span>
          {demo ? (
            <span
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                window.open(demo, '_blank')
              }}
              className="text-sm m-4 -mt-2 text-gray-500 self-start hover:underline hover:text-gray-700"
            >
              Live Example
            </span>
          ) : null}
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
            'p-4 text-gray-700 gap-2',
            'hover:text-gray-900'
          )}
        >
          {icon}
          <span className="flex gap-1">
            {title}
            {animatedArrow}
          </span>
        </span>
      </a>
    </Link>
  )
}

export function Cards({ children, num, ...props }) {
  return (
    <div
      className={cn(styles.cards, 'gap-4 mt-4')}
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
