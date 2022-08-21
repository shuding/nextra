import cn from 'clsx'
import Link from 'next/link'

import styles from './style.module.css'

export function Card({ children, title, icon, href, ...props }) {
  return (
    <Link href={href}>
      <a className={cn(styles.card)} {...props}>
        <span className={styles.title}>
          {icon}
          {title}
        </span>
        {children}
      </a>
    </Link>
  )
}

export function Cards({ children, ...props }) {
  return (
    <div className={cn(styles.cards)} {...props}>
      {children}
    </div>
  )
}
